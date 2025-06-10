import { TypographyH3 } from '@/components/ui/typographyH3';
import { SlackAPIView } from './SlackAPIView';
import { useRxValue } from '@/lib/rxjs/useRx';
import { plugins } from '../../store/pluginsStore';
import { SlackSettingView } from './SlackSettingView';

export const SlackPanel = () => {
  const slackPluginStatus = useRxValue(plugins.slack$$);
  return (
    <div className='flex flex-col gap-4'>
      <div className='px-12 pt-2'>
        <TypographyH3>Slack</TypographyH3>
      </div>
      {!slackPluginStatus?.verified && <SlackAPIView />}
      {slackPluginStatus?.verified && <SlackSettingView />}
    </div>
  );
};
