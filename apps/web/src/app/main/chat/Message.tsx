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

  if (message.role === 'assistant' && message.parts) {
    const assistantMessage = message.parts
      .map(part => {
        if (part.type === 'tool-invocation') {
          return (
            <div
              className='text-gray-400 text-xs'
              key={`tool-${message.id}-${part.toolInvocation.toolCallId}`}
            >
              {part.toolInvocation.toolName}
            </div>
          );
        }
        if (part.type === 'text') {
          return (
            <MemoizedAssistantMessage
              key={`text-${message.id}`}
              id={message.id}
              content={message.content}
            ></MemoizedAssistantMessage>
          );
        }
        return null;
      })
      .filter(Boolean);

    return assistantMessage;
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
