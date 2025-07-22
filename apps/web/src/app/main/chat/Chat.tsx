import { Message, useChat } from '@ai-sdk/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { ToolManager } from '@/app/tools/ToolManager';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInitialPrompt } from './prompt';
import { Thread } from './Thread';
import { UserInput } from './UserInput';

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const initialMessages = useMemo(
    () => [
      {
        role: 'system',
        id: crypto.randomUUID(),
        content: getInitialPrompt(),
        parts: [
          {
            type: 'text',
            text: getInitialPrompt(),
          },
        ],
      },
    ],
    [],
  );

  const { messages, status, setMessages, reload, stop, error } = useChat({
    id: 'chat',
    api: '/api/chat',
    maxSteps: 5,
    onFinish: (_m, o) => {
      console.log('==> onFinish', o);
      console.log(_m);
      console.log('==> token Usage', o.usage.totalTokens);
    },
    onError: e => {
      console.log(e);
    },
    onResponse: res => {
      console.log('==> in res');
    },
    initialMessages: initialMessages as Message[],
    //https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization
    // Throttle the messages and data updates to 50ms
    experimental_throttle: 50,
  });

  const sendMessage = useCallback(() => {
    reload({
      body: {
        tools: ToolManager.getInstance().getServerPayload(),
      },
    });
  }, [reload]);

  useEffect(() => {
    if (status === 'error') {
      toast.error('Error occurred while processing your request.');
    }
  }, [status]);

  const chatMessages = messages.filter(msg => msg.role !== 'system');
  const threads = chatMessages.reduce(
    (acc, message) => {
      if (message.role === 'user') {
        acc.push([message]);
      }
      if (message.role === 'assistant') {
        const lastGroup = acc[acc.length - 1];
        lastGroup.push(message);
      }

      return acc;
    },
    [] as Array<Array<(typeof chatMessages)[0]>>,
  );

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
      <UserInput
        messages={messages}
        setMessages={setMessages}
        status={status}
        stop={stop}
        sendMessage={sendMessage}
      />
    </>
  );
};
