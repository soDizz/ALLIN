import { type UIMessage, useChat } from '@ai-sdk/react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { filter, firstValueFrom, take } from 'rxjs';
import { toast } from 'sonner';
import type { MessageMetadata } from '@/app/api/chat/messageMetadata';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRxValue } from '@/lib/rxjs/useRx';
import { cn } from '@/lib/utils';
import { userPrompt$$ } from '../store/userPromptStore';
import { generateMessage, messagesToThreads } from './chat-helper';
import { messageMinifier } from './message-minifier';
import { getInitialPrompt } from './prompt';
import { Thread } from './Thread';
import { UserInput } from './UserInput';

export type MyMessage = UIMessage<MessageMetadata>;

const ASK_TOKEN_LIMIT = 4500;
const USER_PROMPT_ID = 'user-prompt';

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const messageMinifierRef = useRef(messageMinifier);
  const [cutoffMessages, setCutoffMessages] = useState<MyMessage[]>([]);
  const [tokenUsage, setTokenUsage] = useState(0);
  const userPrompt = useRxValue(userPrompt$$);

  const {
    messages,
    status,
    setMessages,
    sendMessage: reload,
    stop,
    error,
  } = useChat<MyMessage>({
    id: 'chat',
    onFinish: async ({ message }) => {
      const tokenUsage = message.metadata;
      if (tokenUsage?.totalTokens) {
        setTokenUsage(tokenUsage.totalTokens);
      }
    },
    onError: e => {
      toast.error('Error occurred while processing your request.');
    },
    onData: res => {
      console.log('==> in res', res);
    },
    //https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization
    // Throttle the messages and data updates to 50ms
    experimental_throttle: 50,
  });

  useEffect(() => {
    setMessages(prev => [
      ...prev,
      generateMessage('system', getInitialPrompt()),
    ]);
  }, [setMessages]);

  useEffect(() => {
    const minifyMessage = async (messages: MyMessage[]) => {
      const minifiedMessages =
        await messageMinifierRef.current.minify(messages);
      setCutoffMessages(messageMinifierRef.current.cutOffMessages);
      setMessages(minifiedMessages);
    };

    if (tokenUsage > ASK_TOKEN_LIMIT) {
      minifyMessage(messages);
    }

    // @ts-expect-error - 디버깅 용도로 사용한다.
    window.__chat_messages = messages;
  }, [tokenUsage, setMessages, setCutoffMessages]);

  useEffect(() => {
    if (userPrompt) {
      const systemMessage = generateMessage(
        'system',
        userPrompt,
        USER_PROMPT_ID,
      );

      setMessages(prev => [
        ...prev.filter(m => m.id !== USER_PROMPT_ID),
        systemMessage,
      ]);
    }
  }, [setMessages, userPrompt]);

  const sendMessage = useCallback(
    async (newMessage: MyMessage) => {
      // 메세지 최적화 중일 때, 작업이 끝나면 메세지 전송하는 코드
      if (messageMinifierRef.current.isMinifying) {
        await firstValueFrom(
          messageMinifierRef.current.isMinifying$.pipe(
            filter(isMinifying => !isMinifying),
            take(1),
          ),
        );
      }

      setMessages(prev => [...prev, newMessage]);
      reload();
    },
    [reload, setMessages],
  );

  const threads = messagesToThreads([
    ...cutoffMessages,
    ...messages.filter(msg => msg.role !== 'system'),
  ]);

  return (
    <>
      {threads.length > 0 && (
        <ScrollArea
          ref={scrollViewRef}
          style={
            {
              '--data-streaming': status === 'streaming',
            } as React.CSSProperties
          }
          className='prose lg:px-6 max-w-none w-full max-h-[100%] h-0 min-h-0 grow mb-4 [&>div>div]:block! prose-p:my-4 prose-hr:my-4 prose-hr:invisible prose-headings:my-6 prose-li:my-1.5'
          scrollBarClassName='w-6 px-2 !-right-2'
        >
          <div className='p-4 gap-4 flex flex-col'>
            {threads.map((thread, index) => (
              <Thread
                key={`thread-${index}`}
                thread={thread}
                isLast={threads.length - 1 === index}
                status={status}
              ></Thread>
            ))}
          </div>
        </ScrollArea>
      )}
      <motion.div
        layout={'position'}
        className={cn('w-full flex flex-row gap-2 mt-[12px]')}
      >
        <UserInput status={status} stop={stop} sendMessage={sendMessage} />
      </motion.div>
    </>
  );
};
