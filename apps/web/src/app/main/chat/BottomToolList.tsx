import { Slack } from '@/components/icon/slack';
import { ToolToggleButton } from '@/components/ui/tool-toggle-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const BottomToolList = () => {
  return (
    <div className='flex flex-row gap-1 items-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolToggleButton
            className={'size-8'}
            value={false}
            onClick={() => {}}
          >
            <Slack className={'size-4'} />
          </ToolToggleButton>
        </TooltipTrigger>
        <TooltipContent>Slack</TooltipContent>
      </Tooltip>
      <ToolToggleButton
        className={'size-8 p-1'}
        value={false}
        onClick={() => {}}
      >
        <img src={'/clock.png'} alt={'clock'}></img>
      </ToolToggleButton>
    </div>
  );
};
