import { useCallback, useContext, useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from '../localStorageKey';
import { ToolManagerContext } from '@/app/tools/ToolManagerContext';

export const LocalStorageSync = () => {
  const toolManager = useContext(ToolManagerContext);

  const syncSlackWithLocalStorage = useCallback(() => {
    if (!toolManager) return;

    const slackTool = toolManager.getTool('slack');
    const slackCert = localStorage.getItem(LOCAL_STORAGE_KEY.SLACK_CERT);

    const slackPointedChannels = localStorage.getItem(
      LOCAL_STORAGE_KEY.SLACK_POINTED_CHANNELS,
    );

    if (slackCert) {
      slackTool.setCert(JSON.parse(slackCert));
      slackTool.setIsVerified(true);
    }

    if (slackPointedChannels) {
      slackTool.setPointedChannels(JSON.parse(slackPointedChannels));
    }
  }, [toolManager]);

  useEffect(() => {
    syncSlackWithLocalStorage();
  }, [syncSlackWithLocalStorage]);

  return <></>;
};
