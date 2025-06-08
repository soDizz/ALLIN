'use client';

import { useRx } from '@/lib/rxjs/useRx';
import { leftPanel$$ } from '../store/leftPanelStore';

import { SlackPanel } from './SlackPanel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const LeftPanel = () => {
  const [open, setOpen] = useRx(leftPanel$$);

  return (
    <>
      <div
        className={cn('w-[480px] h-full rounded-md border flex flex-col gap-4', !open && 'hidden')}
      >
        <div className='w-full h-[60px] flex flex-row px-4  border-b border-gray-200 items-center'>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            className='cursor-pointer size-10'
            variant={'ghost'}
          >
            <X className='size-6 text-gray-500' />
          </Button>
        </div>
        <SlackPanel />
      </div>
    </>
  );
};
