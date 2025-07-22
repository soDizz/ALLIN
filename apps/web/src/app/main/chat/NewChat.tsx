import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageSquarePlus } from 'lucide-react';

export const NewChat = () => {
  const onClick = () => {};

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant='ghost' size='icon' asChild onClick={onClick}>
          <MessageSquarePlus className='h-9 px-2 min-w-9' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>New Chat</p>
      </TooltipContent>
    </Tooltip>
  );
};
