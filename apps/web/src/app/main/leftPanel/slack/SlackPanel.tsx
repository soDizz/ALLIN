import { SlackLoginView } from './SlackLoginView';
import { useRxValue } from '@/lib/rxjs/useRx';
import { SlackSettingView } from './SlackSettingView';
import { ToolManager } from '@/app/tools/ToolManager';
import { useMemo } from 'react';

export const SlackPanel = () => {
  const slackTool = useMemo(
    () => ToolManager.getInstance().getTool('slack'),
    [],
  );
  const isVerified = useRxValue(slackTool.isVerified$, slackTool.isVerified);

  return (
    <div className='flex flex-col gap-4 grow'>
      {!isVerified && <SlackLoginView />}
      {isVerified && <SlackSettingView />}
    </div>
  );
};
