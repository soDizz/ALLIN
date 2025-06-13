import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRxSet } from '@/lib/rxjs/useRx';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { slackKey$$ } from '../../store/slackKey';
import { plugins } from '../../store/pluginsStore';
import { Input } from '@/components/ui/input';
import ky from 'ky';
import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY, type LocalStorageData } from '../../localStorageKey';
import { SlackGuide } from './SlackGuide';
import { Separator } from '@/components/ui/separator';

export const SlackLoginView = () => {
  const [, setLocalStorageSlack] = useLocalStorage<LocalStorageData['slack'] | null>(
    LOCAL_STORAGE_KEY.SLACK,
    null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const setSlackCredentials = useRxSet(slackKey$$);
  const setPlugins = useRxSet(plugins.slack$$);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('apiKey') as string;
    const teamId = formData.get('teamId') as string;

    if (!token || !teamId) {
      toast.warning('Please enter a valid API Key and Team ID', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setIsChecking(true);

    try {
      await ky.post('/api/validate-slack', {
        json: {
          token,
          teamId,
        },
      });

      setSlackCredentials({ token, teamId });
      setPlugins({
        name: 'slack',
        verified: true,
        active: true,
      });
      setLocalStorageSlack({ token, teamId });

      toast.success('Slack connected successfully!', {
        position: 'top-center',
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Invalid API Key or Team ID', {
        position: 'top-center',
        duration: 3000,
      });
    } finally {
      setIsChecking(false);
    }
  };
  return (
    <>
      <form className='flex flex-col gap-4 p-6' onSubmit={onSubmit}>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='apiKey'>API Token</Label>
          <Input disabled={isChecking} id='apiKey' name='apiKey' />
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='teamId'>Workspace ID</Label>
          <Input disabled={isChecking} id='teamId' name='teamId' />
        </div>
        <Button disabled={isChecking} type='submit'>
          <>
            {isChecking && <Loader2Icon className='animate-spin' />}
            {isChecking ? 'Checking...' : 'Connect'}
          </>
        </Button>
      </form>
      <Separator />
      <SlackGuide />
    </>
  );
};
