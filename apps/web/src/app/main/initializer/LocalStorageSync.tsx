import { useCallback, useContext, useEffect } from 'react';
import { ToolManagerContext } from '@/app/tools/ToolManagerContext';
import { LOCAL_STORAGE_KEY } from '../localStorageKey';

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
      slackTool.setIsActive(true);
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
