import { PanelLeft } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRx } from '@/lib/rxjs/useRx';
import { cn } from '@/lib/utils';
import { leftPanel$$ } from '../leftPanel/leftPanelStore';
import { PromptButtonAndDialog } from './PromptButtonAndDialog';

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
      <PromptButtonAndDialog />
    </div>
  );
};
