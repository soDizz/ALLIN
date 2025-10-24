import { memo } from 'react';
import { MemoizedMarkdown } from './memoized-markdown';

export const MemoizedAssistantMessage = memo(
  ({ content, id }: { content: string; id: string }) => {
    return (
      <div>
        <MemoizedMarkdown id={id} content={content}></MemoizedMarkdown>
      </div>
    );
  },
);

MemoizedAssistantMessage.displayName = 'MemoizedAssistantMessage';
