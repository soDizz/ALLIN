import { MiniThread } from './MiniThread';

export const RightPanel = () => {
  return (
    <div className='p-4 w-[180px] h-full rounded-md border flex flex-col shrink-0 bg-yellow-100'>
      <MiniThread thread={[]} />
    </div>
  );
};
