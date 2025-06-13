import { SlackLoginView } from './SlackLoginView';
import { useRxValue } from '@/lib/rxjs/useRx';
import { plugins } from '../../store/pluginsStore';
import { SlackSettingView } from './SlackSettingView';

export const SlackPanel = () => {
  const slackPluginStatus = useRxValue(plugins.slack$$);
  return (
    <div className='flex flex-col gap-4 grow'>
      {!slackPluginStatus?.verified && <SlackLoginView />}
      {slackPluginStatus?.verified && <SlackSettingView />}
    </div>
  );
};
