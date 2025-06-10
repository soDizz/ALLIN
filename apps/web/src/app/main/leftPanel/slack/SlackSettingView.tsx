import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { plugins } from '../../store/pluginsStore';
import { useRx } from '@/lib/rxjs/useRx';

export const SlackSettingView = () => {
  const [slackPlugin, setSlackPlugin] = useRx(plugins.slack$$);

  const onChange = (checked: boolean) => {
    setSlackPlugin(prev => ({
      ...prev,
      active: checked,
    }));
  };

  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-4'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Active</Label>
        </div>
        <Switch checked={slackPlugin.active} onCheckedChange={onChange} id='slack-active-status' />
      </div>
    </div>
  );
};
