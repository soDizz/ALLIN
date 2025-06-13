import { Toggle } from '@/components/ui/toggle';
import { PanelLeft } from 'lucide-react';
import { useRx } from '@/lib/rxjs/useRx';
import { leftPanel$$ } from '../store/leftPanelStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [open, setOpen] = useRx(leftPanel$$);
  return (
    <div className='w-full flex flex-row items-center justify-between'>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Toggle
            pressed={open}
            onPressedChange={setOpen}
            aria-label='Toggle side bar'
            className='cursor-pointer'
            asChild
          >
            <PanelLeft className={cn(!open && 'text-gray-500')} />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-xs text-gray-300'>Toggle Side Bar</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
