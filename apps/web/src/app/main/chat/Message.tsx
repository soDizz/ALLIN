import type { UIMessage } from '@ai-sdk/react';
import { MemoizedAssistantMessage } from './memoized-assistant-message';
import { MemoizedUserMessage } from './memoized-user-message';

type MessageItemProps = {
  message: UIMessage;
  userMessageRef?: React.RefObject<HTMLDivElement>;
};

export const Message = ({ message, userMessageRef }: MessageItemProps) => {
  if (message.role === 'user') {
    let userMessage = '';

    if (message.parts[0].type === 'text') {
      userMessage = message.parts[0].text;
    }

    return <MemoizedUserMessage ref={userMessageRef} content={userMessage} />;
  }

  if (message.role === 'assistant' && message.parts) {
    const assistantMessage = message.parts
      .map(part => {
        if (part.type === 'dynamic-tool') {
          return (
            <div
              className='text-gray-400 text-xs'
              key={`tool-${message.id}-${part.toolCallId}`}
            >
              {part.toolName}
            </div>
          );
        }
        if (part.type === 'text') {
          return (
            <MemoizedAssistantMessage
              key={`text-${message.id}`}
              id={message.id}
              content={part.text}
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
