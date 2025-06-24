import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { useChat } from '@ai-sdk/react';
import type { RefObject } from 'react';

type ChatLogProps = {
  messages: ReturnType<typeof useChat>['messages'];
  scrollRef: RefObject<HTMLDivElement | null>;
};

const getBadgeVariant = (type: 'system' | 'user' | 'assistant' | 'data') => {
  if (type === 'system') {
    return 'secondary';
  }
  if (type === 'user') {
    return 'default';
  }
  return 'outline';
};

export const ChatLog = ({ messages, scrollRef }: ChatLogProps) => {
  return (
    <div className='w-full h-[600px]' ref={scrollRef}>
      <ScrollArea className='h-full'>
        <div className='w-full flex flex-col gap-4 pt-4'>
          {messages.map(message => {
            const type = message.role;

            return (
              <Badge
                variant={getBadgeVariant(type)}
                className={cn(
                  'text-sm whitespace-pre-wrap max-w-[75%]',
                  type !== 'assistant' && 'ml-auto',
                )}
                key={message.id}
              >
                {message.content}
              </Badge>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
