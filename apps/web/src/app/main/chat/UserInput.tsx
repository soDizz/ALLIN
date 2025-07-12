import type { useChat } from '@ai-sdk/react';
import { ChevronUp, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { type ChangeEventHandler, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRxEffect } from '@/lib/rxjs/useRxEffect';
import { cn } from '@/lib/utils';

export const textAreaFocusTrigger$ = new Subject<void>();

type UserInputProps = {
  messages: ReturnType<typeof useChat>['messages'];
  setMessages: ReturnType<typeof useChat>['setMessages'];
  stop: ReturnType<typeof useChat>['stop'];
  status: ReturnType<typeof useChat>['status'];
  sendMessage: () => void;
};

export const UserInput = ({
  messages,
  setMessages,
  stop,
  sendMessage,
  status,
}: UserInputProps) => {
  const [input, setInput] = useState<string>('');
  const submitRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // event.key가 'Enter'이고, Cmd(mac) 또는 Ctrl(windows) 키가 함께 눌렸는지 확인
    // 한글 입력 시 keydown 이 2번 호출되는 문제가 있어서, isComposing 체크
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.stopPropagation();
      onSubmit();
    }
  };

  useRxEffect(textAreaFocusTrigger$, () => {
    // textAreaFocusTrigger$가 발행되면, 텍스트 영역에 포커스를 설정
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  });

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

    // const selectedChannelIds = selectedSlackChannels$$
    //   .get()
    //   .map(ch => ch.channelId)
    //   .toString();
    // const selectedChannelNames = selectedSlackChannels$$
    //   .get()
    //   .map(ch => ch.channelName)
    //   .toString();

    // const systemPrompt = `When execute Slack tool, you must search or post in that channels. channelIds: ${selectedChannelIds} channelNames: ${selectedChannelNames}`;

    setMessages(prev => [
      ...prev,
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
    sendMessage();
    setInput('');
  };

  const isStreamingOrSubmitting =
    status === 'streaming' || status === 'submitted';

  return (
    <motion.section
      layout={'position'}
      className={cn('w-full flex flex-col gap-2 mt-[12px]')}
    >
      <form
        ref={submitRef}
        onSubmit={onSubmit}
        className='w-full relative flex flex-row gap-2 items-center shrink-0'
      >
        <Textarea
          ref={textAreaRef}
          autoFocus
          aria-label='ask to ai'
          placeholder='Ask me'
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          maxLength={1000}
          className='pr-14 max-h-48'
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
              {isStreamingOrSubmitting ? (
                <Square onClick={stop} />
              ) : (
                <ChevronUp />
              )}
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
