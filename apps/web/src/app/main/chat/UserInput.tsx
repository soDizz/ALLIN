import { TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'motion/react';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import { BottomToolList } from './BottomToolList';
import { ChevronUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { useRef } from 'react';

type UserInputProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: ReturnType<typeof useChat>['handleSubmit'];
  status: ReturnType<typeof useChat>['status'];
  stop: () => void;
};

export const UserInput = ({
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
}: UserInputProps) => {
  const submitRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // event.key가 'Enter'이고, Cmd(mac) 또는 Ctrl(windows) 키가 함께 눌렸는지 확인
    // 한글 입력 시 keydown 이 2번 호출되는 문제가 있어서, isComposing 체크
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      onSubmit();
    }
  };

  const onSubmit = () => {
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

    handleSubmit();
  };

  const isStreamingOrSubmitting = status === 'streaming' || status === 'submitted';

  return (
    <motion.section layout={'position'} className={cn('w-full flex flex-col gap-2 mt-[12px]')}>
      <form
        ref={submitRef}
        onSubmit={onSubmit}
        className='w-full relative flex flex-row gap-2 items-center shrink-0'
      >
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
              type='button'
              onClick={onSubmit}
              className='cursor-pointer absolute right-3 size-8'
              variant={'outline'}
              aria-label={isStreamingOrSubmitting ? 'Stop' : 'Submit'}
            >
              {isStreamingOrSubmitting ? <Square onClick={stop} /> : <ChevronUp />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Submit</p>
            <ContextMenuShortcut>⌘ Enter</ContextMenuShortcut>
          </TooltipContent>
        </Tooltip>
      </form>
      <BottomToolList />
    </motion.section>
  );
};
