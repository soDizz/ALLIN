import type { Message as AiMessage } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Message } from './Message';

type ThreadProps = {
  thread: Array<AiMessage>;
  isLast: boolean;
};

export const Thread = ({ thread, isLast }: ThreadProps) => {
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

  return (
    <>
      {userMessages && (
        <Message
          key={userMessages[0].id}
          message={userMessages[0]}
          userMessageRef={ref as React.RefObject<HTMLDivElement>}
        />
      )}
      <article style={isLast ? { minHeight: 'calc(-264px + 100dvh)' } : {}}>
        {assistantMessages.map(message => {
          return <Message key={message.id} message={message}></Message>;
        })}
      </article>
    </>
  );
};
