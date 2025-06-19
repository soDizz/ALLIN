import { Slack } from '@/components/icon/slack';
import { ToolToggleButton } from '@/components/ui/tool-toggle-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRx } from '@/lib/rxjs/useRx';
import { Clock2 } from 'lucide-react';
import { toast } from 'sonner';
import { leftPanel$$ } from '../store/leftPanelStore';
import { toolsStatus } from '../store/toolsStatusStore';

export const BottomToolList = () => {
  const [slackPlugin, setSlackPlugin] = useRx(toolsStatus.slack$$);
  const [timePlugin, setTimePlugin] = useRx(toolsStatus.time$$);

  const onClick = () => {
    if (!slackPlugin.verified) {
      leftPanel$$.set(true);
      toast.info('Please verify your Slack API key and team ID', {
        position: 'top-center',
        duration: 5000,
      });
    } else {
      setSlackPlugin(prev => ({
        ...prev,
        active: !prev.active,
      }));
    }
  };

  const onClickTime = () => {
    setTimePlugin(prev => ({
      ...prev,
      active: !prev.active,
    }));
  };

  return (
    <div aria-label='plugin group' className='flex flex-row gap-1 items-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolToggleButton className={'size-8'} value={slackPlugin.active} onClick={onClick}>
            <Slack className={'size-4'} />
          </ToolToggleButton>
        </TooltipTrigger>
        <TooltipContent>Slack</TooltipContent>
      </Tooltip>
      <ToolToggleButton className={'size-8 p-1'} value={timePlugin.active} onClick={onClickTime}>
        <img src={'/clock.png'} alt={'clock'}></img>
      </ToolToggleButton>
    </div>
  );
};
