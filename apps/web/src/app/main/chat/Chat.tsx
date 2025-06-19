import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './Message';
import { useChat } from '@ai-sdk/react';
import { UserInput } from './UserInput';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { toolsStatus } from '../store/toolsStatusStore';

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleSubmitChat,
    stop,
    status,
    // setMessages,
  } = useChat({
    api: '/api/chat',
    body: {
      enabledTools: toolsStatus.getEnabledTools(),
    },
    maxSteps: 5,
    onFinish: () => {
      scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: e => {
      console.log(e);
    },
  });

  useEffect(() => {
    if (status === 'error') {
      toast.error('Error occurred while processing your request.');
    }
  }, [status]);

  return (
    <>
      {messages.length > 0 && (
        <ScrollArea
          style={
            {
              '--data-streaming': status === 'streaming',
            } as React.CSSProperties
          }
          className='w-full max-h-[100%] h-0 min-h-0 grow mb-4 [&>div>div]:block!'
        >
          <div className='p-4 gap-4 flex flex-col'>
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={scrollViewRef} className='h-[1px] w-full invisible' />
          </div>
        </ScrollArea>
      )}
      <UserInput
        input={input}
        handleInputChange={handleInputChange}
        stop={stop}
        handleSubmit={handleSubmitChat}
        status={status}
      />
    </>
  );
};
