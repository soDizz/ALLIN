import { memo } from 'react';
import { MemoizedMarkdown } from './memoized-markdown';

export const MemoizedAssistantMessage = memo(({ content }: { content: string }) => {
  return <MemoizedMarkdown content={content}></MemoizedMarkdown>;
});

MemoizedAssistantMessage.displayName = 'MemoizedAssistantMessage';
