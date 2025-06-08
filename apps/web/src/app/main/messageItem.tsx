import type { Message } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

type MessageItemProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageItemProps) => {
  const content = message.parts?.map((part, i) => {
    switch (part.type) {
      case 'text':
        return <ReactMarkdown key={`${message.id}-${i}`}>{part.text}</ReactMarkdown>;
      case 'tool-invocation':
        return <pre key={`${message.id}-${i}`}>{JSON.stringify(part.toolInvocation, null, 2)}</pre>;
      default:
        return null;
    }
  });

  if (message.role === 'user') {
    return (
      <div key={message.id} className='flex flex-col gap-4 mt-4'>
        <h1 className='inline font-bold text-2xl'>{content}</h1>
      </div>
    );
  }

  return (
    <div key={message.id} className='mt-0.5 prose'>
      {content}
    </div>
  );
};
