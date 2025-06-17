'use client';

import { useRxValue } from '@/lib/rxjs/useRx';
import { leftPanel$$ } from '../store/leftPanelStore';

import { SlackPanel } from './slack/SlackPanel';
import { cn } from '@/lib/utils';
import { TypographyH3 } from '@/components/ui/typographyH3';

export const LeftPanel = () => {
  const open = useRxValue(leftPanel$$);

  return (
    <>
      <div
        className={cn(
          'w-[480px] h-full rounded-md border flex flex-col gap-4 overflow-y-auto',
          !open && 'hidden',
        )}
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
    </>
  );
};
