import { Badge } from '@/components/ui/badge';
import { memo } from 'react';

export const MemoizedUserMessage = memo(({ content }: { content: string }) => {
  return (
    <div className='not-prose flex flex-col my-4 ml-auto max-w-[80%]'>
      <Badge className='text-sm p-2 rounded-xl text-wrap whitespace-pre-wrap break-keep'>
        {content}
      </Badge>
    </div>
  );
});

MemoizedUserMessage.displayName = 'MemoizedUserMessage';
