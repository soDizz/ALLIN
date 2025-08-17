import type { UIMessage, useChat } from '@ai-sdk/react';
import { ChevronUp, Square } from 'lucide-react';
// import { motion } from 'motion/react';
import { type ChangeEventHandler, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import type { MessageMetadata } from '@/app/api/chat/messageMetadata';
import { AIGlass } from '@/components/ui/ai-glass/AIGlass';
import { Button } from '@/components/ui/button';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRxEffect } from '@/lib/rxjs/useRxEffect';
import { Bear } from './Bear';
// import { Bear } from './Bear';
import { generateMessage } from './chat-helper';

export const textAreaFocusTrigger$ = new Subject<void>();

type UserInputProps = {
  stop: ReturnType<typeof useChat>['stop'];
  status: ReturnType<typeof useChat>['status'];
  sendMessage: (message: UIMessage<MessageMetadata>) => void;
};

export const UserInput = ({ stop, sendMessage, status }: UserInputProps) => {
  const [input, setInput] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-5');
  const submitRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const bearControllerRef = useRef<GSAPTimeline | null>(null);
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
    if (status === 'streaming' || status === 'submitted') {
      stop();
      return;
    }

    if (status === 'ready' && !input) {
      if (bearControllerRef.current?.progress() === 1) {
        bearControllerRef.current?.progress(0);
      }

      bearControllerRef.current?.play();
      return;
    }

    // 요청 할때마다 최신 정보를 가져와서 API 를 호출한다. (이게 없으면 리렌더가 되지 않으면 이전 값을 보냄)
    sendMessage(generateMessage('user', input));
    setInput('');
  };

  const isStreamingOrSubmitting =
    status === 'streaming' || status === 'submitted';

  return (
    <form
      ref={submitRef}
      onSubmit={onSubmit}
      className='w-full relative flex flex-row gap-2 items-center shrink-0'
    >
      <div className='w-full rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]'>
        <div className='pl-3 pt-2 '>
          <Textarea
            ref={textAreaRef}
            autoFocus
            aria-label='ask to ai'
            placeholder='Ask anything'
            value={input}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            maxLength={2500}
            className='max-h-48 min-h-8 scroll-py-2 border-0 rounded-none shadow-none focus-visible:ring-0 p-0 pr-14'
          />
        </div>
        <div className='pl-2 pb-1 '>
          <div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger
                size='sm'
                className='h-6 px-2 py-0 text-xs border-none gap-1 shadow-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:border-transparent bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent text-muted-foreground select-none'
              >
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={e => e.preventDefault()}>
                <SelectItem value='gpt-5'>gpt-5</SelectItem>
                <SelectItem value='gpt-4'>gpt-4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Bear bearControllerRef={bearControllerRef} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            onClick={onSubmit}
            className='cursor-pointer absolute right-4 size-8'
            variant={isStreamingOrSubmitting ? 'default' : 'outline'}
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
  );
};
