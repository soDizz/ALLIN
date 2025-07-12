import { useChat } from '@ai-sdk/react';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './Message';
import { createPrompt } from './prompt';
import { UserInput } from './UserInput';
import { ToolManager } from '@/app/tools/ToolManager';

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);

  const { messages, status, setMessages, reload, stop } = useChat({
    id: 'chat',
    api: '/api/chat',
    maxSteps: 5,
    onFinish: (m, o) => {
      console.log('==> token Usage', o.usage.totalTokens);
    },
    onError: e => {
      console.log(e);
    },
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
    const presetPrompt = createPrompt();

    setMessages(prev => [
      ...prev,
      {
        role: 'system',
        id: crypto.randomUUID(),
        content: presetPrompt,
        parts: [
          {
            type: 'text',
            text: presetPrompt,
          },
        ],
      },
    ]);
  }, [setMessages]);

  useEffect(() => {
    if (status === 'error') {
      toast.error('Error occurred while processing your request.');
    }
  }, [status]);

  return (
    <>
      {messages.filter(msg => msg.role !== 'system').length > 0 && (
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
            {messages
              .filter(msg => msg.role !== 'system')
              .map(message => (
                <Message key={message.id} message={message} />
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
