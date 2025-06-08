'use client';

import { ChevronUp, Square } from 'lucide-react';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SlackToggleButton } from '@/components/icon/slack';
import { useChat } from '@ai-sdk/react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './messageItem';
import { toast } from 'sonner';
import { leftPanel$$ } from './store/leftPanelStore';

export const Main = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleSubmitChat,
    stop,
    status,
  } = useChat();

  const handleSubmit = () => {
    if (status === 'streaming') {
      stop();
      return;
    }

    if (status === 'ready' && !input) {
      toast.info('Please enter a question', {
        duration: 3000,
      });
      return;
    }
    console.log('submit');
    handleSubmitChat();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // event.key가 'Enter'이고, Cmd(mac) 또는 Ctrl(windows) 키가 함께 눌렸는지 확인
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault(); // 기본 동작(줄바꿈) 방지
      handleSubmit();
    }
  };

  return (
    <motion.main
      className='w-full h-full gap-[12px] p-8 grow flex flex-col items-center'
      layout={'position'}
    >
      <div className='w-full h-full  lg:max-w-2xl max-w-4xl flex justify-center items-center flex-col'>
        {messages.length > 0 && (
          <ScrollArea className='w-full max-h-[100%] h-0 min-h-0 grow mb-4'>
            <div className='p-4 gap-4 flex flex-col'>
              {messages.map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
        )}
        <motion.section layout={'position'} className={cn('w-full flex flex-col gap-2 mt-[12px]')}>
          <div className='w-full relative flex flex-row gap-2 items-center shrink-0'>
            <Textarea
              aria-label='ask to ai'
              placeholder='Ask me'
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              className='pr-14'
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSubmit}
                  className='cursor-pointer absolute right-3 size-8'
                  variant={'outline'}
                >
                  {status === 'streaming' ? <Square /> : <ChevronUp />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Submit</p>
                <ContextMenuShortcut>⌘ Enter</ContextMenuShortcut>
              </TooltipContent>
            </Tooltip>
          </div>
          <div aria-label='plugin group' className='flex flex-row gap-1 items-center'>
            <SlackToggleButton
              onToggle={() => {
                leftPanel$$.set(prev => !prev);
              }}
              size={10}
            />
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
};
