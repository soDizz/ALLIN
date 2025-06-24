import type { Message as AiMessage } from '@ai-sdk/react';
import { MemoizedUserMessage } from './memoized-user-message';
import { MemoizedAssistantMessage } from './memoized-assistant-message';

type MessageItemProps = {
  message: AiMessage;
};

export const Message = ({ message }: MessageItemProps) => {
  if (message.role === 'user') {
    return <MemoizedUserMessage content={message.content} />;
  }

  if (message.role === 'assistant') {
    return <MemoizedAssistantMessage content={message.content}></MemoizedAssistantMessage>;
  }

  return null;

  // const content = message.parts?.map((part, i) => {
  //   switch (part.type) {
  //     case 'text':
  //       return <MemoizedMarkdown content={part.text} />;
  //     case 'tool-invocation':
  //       return (
  //         <p
  //           className='text-xs text-muted-foreground'
  //           key={`${message.id}-${i}`}
  //         >{`calling ${part.toolInvocation.toolName}...`}</p>
  //       );
  //     default:
  //       return null;
  //   }
  // });
};
