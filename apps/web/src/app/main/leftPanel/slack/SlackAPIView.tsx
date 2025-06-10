import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRxSet } from '@/lib/rxjs/useRx';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { slackKey$$ } from '../../store/slackKey';
import { plugins } from '../../store/pluginsStore';
import { Input } from '@/components/ui/input';

const validateSlackKey = async (token: string, teamId: string) => {
  try {
    const response = await fetch('/api/validate-slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, teamId }),
    });

    return response.ok;
  } catch {
    return false;
  }
};

export const SlackAPIView = () => {
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
    const isValid = await validateSlackKey(token, teamId);

    if (isValid) {
      setSlackCredentials({ token, teamId });
      setPlugins({
        name: 'slack',
        verified: true,
        active: true,
      });
      toast.success('Slack connected successfully!', {
        position: 'top-center',
        duration: 3000,
      });
    } else {
      toast.error('Invalid API Key or Team ID', {
        position: 'top-center',
        duration: 3000,
      });
    }

    setIsChecking(false);
  };
  return (
    <form className='flex flex-col gap-4 p-12' onSubmit={onSubmit}>
      <div className='grid w-full max-w-sm items-center gap-3'>
        <Label htmlFor='apiKey'>API Key</Label>
        <Input disabled={isChecking} id='apiKey' name='apiKey' />
      </div>
      <div className='grid w-full max-w-sm items-center gap-3'>
        <Label htmlFor='teamId'>Team ID</Label>
        <Input disabled={isChecking} id='teamId' name='teamId' />
      </div>
      <Button disabled={isChecking} type='submit'>
        <>
          {isChecking && <Loader2Icon className='animate-spin' />}
          {isChecking ? 'Checking...' : 'Connect'}
        </>
      </Button>
    </form>
  );
};
