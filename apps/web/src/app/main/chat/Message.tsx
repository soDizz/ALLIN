import type { Message as AiMessage } from '@ai-sdk/react';
import { MemoizedAssistantMessage } from './memoized-assistant-message';
import { MemoizedUserMessage } from './memoized-user-message';

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
};
