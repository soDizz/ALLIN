import { memo } from 'react';
import { MemoizedMarkdown } from './memoized-markdown';

export const MemoizedAssistantMessage = memo(({ content }: { content: string }) => {
  return (
    <div>
      <MemoizedMarkdown content={content}></MemoizedMarkdown>
    </div>
  );
});

MemoizedAssistantMessage.displayName = 'MemoizedAssistantMessage';
