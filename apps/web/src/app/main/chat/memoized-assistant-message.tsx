import { memo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
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
