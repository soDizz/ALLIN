import { SlackToggleButton } from '@/components/icon/slack';
import { useRx } from '@/lib/rxjs/useRx';
import { toast } from 'sonner';
import { plugins } from '../store/pluginsStore';
import { leftPanel$$ } from '../store/leftPanelStore';

export const ToolList = () => {
  const [slackPlugin, setSlackPlugin] = useRx(plugins.slack$$);

  const onClick = () => {
    if (!slackPlugin.verified) {
      leftPanel$$.set(true);
      toast.warning('Please verify your Slack API key and team ID', {
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

  return (
    <div aria-label='plugin group' className='flex flex-row gap-1 items-center'>
      <SlackToggleButton value={slackPlugin.active} onClick={onClick} size={10} />
    </div>
  );
};
