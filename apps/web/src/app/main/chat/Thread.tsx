import type { Message as AiMessage, useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import styles from './Thread.module.css';

type ThreadProps = {
  thread: Array<AiMessage>;
  isLast: boolean;
  status: ReturnType<typeof useChat>['status'];
};

export const Thread = ({ thread, isLast, status }: ThreadProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isLast) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isLast]);

  const userMessages = thread.filter(message => message.role === 'user');
  const assistantMessages = thread.filter(
    message => message.role === 'assistant',
  );

  const isGeneratingFinished = status !== 'streaming' && status !== 'submitted';

  return (
    <>
      {userMessages && (
        <Message
          key={userMessages[0].id}
          message={userMessages[0]}
          userMessageRef={ref as React.RefObject<HTMLDivElement>}
        />
      )}
      <div
        className={cn(
          'flex items-center justify-center gap-1.5 mt-[-1rem] mb-[-1rem] text-sm text-muted-foreground',
          (!isLast || isGeneratingFinished) && 'opacity-0',
          (!isLast || isGeneratingFinished) && 'blur-[2px]',
          styles.loading,
        )}
      >
        <Spinner size='xs' />
        <p className='text-xs !m-0'>{isLast ? 'Generating...' : 'Completed'}</p>
      </div>
      <article style={isLast ? { minHeight: 'calc(-264px + 100dvh)' } : {}}>
        {assistantMessages.map(message => {
          return <Message key={message.id} message={message}></Message>;
        })}
      </article>
    </>
  );
};
