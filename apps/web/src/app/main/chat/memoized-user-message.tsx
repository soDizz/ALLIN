import { memo } from 'react';

export const MemoizedUserMessage = memo(({ content }: { content: string }) => {
  return (
    <div className='not-prose flex flex-col gap-4 mt-4'>
      <h1 className='inline font-bold text-2xl'>{content}</h1>
    </div>
  );
});

MemoizedUserMessage.displayName = 'MemoizedUserMessage';
