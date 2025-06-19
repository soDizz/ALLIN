import type { SlackValidateBodyParams } from '@/app/api/slack/validate/route';
import { useRxSet } from '@/lib/rxjs/useRx';
import { assert } from '@agentic/core';
import ky from 'ky';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY, type LocalStorageData } from '../localStorageKey';
import { slack$$ } from '../store/slackStore';
import { toolsStatus } from '../store/toolsStatusStore';

export const LocalStorageSlack = () => {
  const [localStorageSlackData, setLocalStorageSlackData] = useLocalStorage<
    LocalStorageData['slack'] | null
  >(LOCAL_STORAGE_KEY.SLACK, null);
  const [localStorageActiveTools, setLocalStorageActiveTools] = useLocalStorage<
    LocalStorageData['activeTools']
  >(LOCAL_STORAGE_KEY.ACTIVE_TOOLS, []);

  const setSlackData = useRxSet(slack$$);
  const setToolsStatus = useRxSet(toolsStatus.slack$$);

  useEffect(() => {
    const verifySlack = async () => {
      try {
        assert(localStorageSlackData?.token);
        assert(localStorageSlackData?.workspaceId);
        assert(localStorageSlackData.selectedChannels);

        const { token, workspaceId, selectedChannels } = localStorageSlackData;
        await ky.post('/api/slack/validate', {
          json: {
            token,
            workspaceId,
          } as SlackValidateBodyParams,
        });

        const wasActive = localStorageActiveTools.includes('slack');

        setSlackData({ token, workspaceId, selectedChannels });
        setToolsStatus({
          name: 'slack',
          verified: true,
          active: wasActive,
        });
      } catch {
        setLocalStorageSlackData({
          token: '',
          workspaceId: '',
          selectedChannels: [],
        });
        setLocalStorageActiveTools(prev => [...prev.filter(name => name !== 'slack')]);
      }
    };

    verifySlack();
    // 마운트 될때 한번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
