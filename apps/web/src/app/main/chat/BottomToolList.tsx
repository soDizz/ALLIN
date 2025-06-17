import { Slack } from '@/components/icon/slack';
import { useRx } from '@/lib/rxjs/useRx';
import { toast } from 'sonner';
import { plugins } from '../store/pluginsStore';
import { leftPanel$$ } from '../store/leftPanelStore';
import { ToolToggleButton } from '@/components/ui/tool-toggle-button';
import { Clock2 } from 'lucide-react';

export const BottomToolList = () => {
  const [slackPlugin, setSlackPlugin] = useRx(plugins.slack$$);
  const [timePlugin, setTimePlugin] = useRx(plugins.time$$);

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
      <ToolToggleButton value={slackPlugin.active} onClick={onClick}>
        <Slack />
      </ToolToggleButton>
      <ToolToggleButton value={timePlugin.active} onClick={onClickTime}>
        <Clock2 />
      </ToolToggleButton>
    </div>
  );
};
