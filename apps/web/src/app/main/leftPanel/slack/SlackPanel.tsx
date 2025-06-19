import { SlackLoginView } from './SlackLoginView';
import { useRxValue } from '@/lib/rxjs/useRx';
import { toolsStatus } from '../../store/toolsStatusStore';
import { SlackSettingView } from './SlackSettingView';

export const SlackPanel = () => {
  const slackPluginStatus = useRxValue(toolsStatus.slack$$);
  return (
    <div className='flex flex-col gap-4 grow'>
      {!slackPluginStatus?.verified && <SlackLoginView />}
      {slackPluginStatus?.verified && <SlackSettingView />}
    </div>
  );
};
