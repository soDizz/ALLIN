import { Badge } from '@/components/ui/badge';
import { memo } from 'react';

export const MemoizedUserMessage = memo(({ content }: { content: string }) => {
  return (
    <div className='not-prose flex flex-col my-4 ml-auto max-w-[80%]'>
      <Badge className='text-lg p-3 rounded-3xl text-wrap break-keep'>{content}</Badge>
    </div>
  );
});

MemoizedUserMessage.displayName = 'MemoizedUserMessage';
