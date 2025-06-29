import { TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'motion/react';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import { ChevronUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { type ChangeEventHandler, useRef, useState } from 'react';
import { selectedSlackChannels$$ } from '../leftPanel/slack/slackSelectedChannelStore';
import { toolsStatus } from '../store/toolsStatusStore';

type UserInputProps = {
  messages: ReturnType<typeof useChat>['messages'];
  setMessages: ReturnType<typeof useChat>['setMessages'];
  stop: ReturnType<typeof useChat>['stop'];
  status: ReturnType<typeof useChat>['status'];
  reload: ReturnType<typeof useChat>['reload'];
};

export const UserInput = ({ messages, setMessages, stop, reload, status }: UserInputProps) => {
  const [input, setInput] = useState<string>('');
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

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setInput(e.target.value);
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

    const selectedChannelIds = selectedSlackChannels$$
      .get()
      .map(ch => ch.channelId)
      .toString();
    const selectedChannelNames = selectedSlackChannels$$
      .get()
      .map(ch => ch.channelName)
      .toString();

    const systemPrompt = `When execute Slack tool, you must search or post in that channels. channelIds: ${selectedChannelIds} channelNames: ${selectedChannelNames}`;
    setMessages(prev => [
      ...prev,
      // {
      //   role: 'system',
      //   id: crypto.randomUUID(),
      //   content: systemPrompt,
      //   parts: [
      //     {
      //       type: 'text',
      //       text: systemPrompt,
      //     },
      //   ],
      // },
      {
        role: 'user',
        id: crypto.randomUUID(),
        content: input,
        parts: [
          {
            type: 'text',
            text: input,
          },
        ],
      },
    ]);

    // 요청 할때마다 최신 정보를 가져와서 API 를 호출한다. (이게 없으면 리렌더가 되지 않으면 이전 값을 보냄)
    reload({
      body: {
        enabledTools: toolsStatus.getEnabledTools(),
      },
    });
    setInput('');
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
          onChange={onChange}
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
      {/* <BottomToolList /> */}
    </motion.section>
  );
};
