import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY, type LocalStorageData } from '../localStorageKey';
import { useEffect } from 'react';
import ky from 'ky';
import { useRxSet } from '@/lib/rxjs/useRx';
import { slackKey$$ } from '../store/slackKey';
import { plugins } from '../store/pluginsStore';
import { toast } from 'sonner';

export const LocalStorageSlack = () => {
  const [slackKey] = useLocalStorage<LocalStorageData['slack'] | null>(
    LOCAL_STORAGE_KEY.SLACK,
    null,
  );
  const setSlackCredentials = useRxSet(slackKey$$);
  const setPlugins = useRxSet(plugins.slack$$);

  useEffect(() => {
    const verifySlack = async () => {
      if (slackKey?.token && slackKey?.teamId && !plugins.slack$$.get().verified) {
        try {
          await ky.post('/api/validate-slack', {
            json: {
              token: slackKey.token,
              teamId: slackKey.teamId,
            },
          });

          setSlackCredentials({ token: slackKey.token, teamId: slackKey.teamId });
          setPlugins({
            name: 'slack',
            verified: true,
            active: true,
          });
          toast.success('Slack is Connected', {
            position: 'top-center',
            duration: 2500,
          });
        } catch {}
      }
    };

    verifySlack();
  }, []);
  return <></>;
};
