import type { UIMessage } from '@ai-sdk/react';
import { motion } from 'motion/react';
import { useEffect, useId } from 'react';
import type { MessageMetadata } from '@/app/api/chat/messageMetadata';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/core/react/useChat';
import { cn } from '@/lib/utils';
import { generateUIMessage, messagesToThreads } from '../../../core/helper';
import { getInitialPrompt } from './prompt';
import { Thread } from './Thread';
import { UserInput } from './UserInput';

export type MyMessage = UIMessage<MessageMetadata>;

export const Chat = () => {
  const chatId = useId();
  const { uiMessages, sendMessage, setMessageContext, status, stop } =
    useChat<MyMessage>({
      id: chatId,
      api: '/api/chat',
      experimental_throttle: 50,
    });

  useEffect(() => {
    setMessageContext(prev => [
      ...prev,
      generateUIMessage(
        'system',
        getInitialPrompt(),
      ) as UIMessage<MessageMetadata>,
    ]);
  }, []);

  const threads = messagesToThreads([...uiMessages]);

  return (
    <>
      {threads.length > 0 && (
        <ScrollArea
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
