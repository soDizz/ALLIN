'use client';

import { useEffect, useRef } from 'react';
import { TypographyH3 } from '@/components/ui/typographyH3';
import { useRxValue } from '@/lib/rxjs/useRx';
import { cn } from '@/lib/utils';
import { leftPanel$$ } from './leftPanelStore';
import { SlackPanel } from './slack/SlackPanel';

export const LeftPanel = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const open = useRxValue(leftPanel$$);

  useEffect(() => {
    if (open) {
      wrapperRef.current?.focus();
    }
  }, [open]);
  return (
    <div
      ref={wrapperRef}
      className={cn(
        'w-[480px] h-full rounded-md border flex flex-col gap-4 overflow-y-auto',
        !open && 'hidden',
      )}
      tabIndex={-1}
    >
      <div className='w-full h-[60px] flex flex-row px-4  border-b border-gray-200 items-center shrink-0'>
        {
          <div className='px-2'>
            <TypographyH3>Slack</TypographyH3>
          </div>
        }
      </div>
      <SlackPanel />
    </div>
  );
};
