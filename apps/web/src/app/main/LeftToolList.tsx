import { leftPanel$$ } from './store/leftPanelStore';
import { toolsStatus } from './store/toolsStatusStore';
import { useRx } from '@/lib/rxjs/useRx';
import { toast } from 'sonner';

export const PluginList = () => {
  const [slackPlugin, setSlackPlugin] = useRx(toolsStatus.slack$$);

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

  return <div aria-label='plugin group' className='flex flex-row gap-1 items-center'></div>;
};
