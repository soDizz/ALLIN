import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { TypographyH3 } from '@/components/ui/typographyH3';
import { useRx } from '@/lib/rxjs/useRx';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { slackKey$$ } from '../store/slackKey';

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
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const SlackPanel = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [slackCredentials, setSlackCredentials] = useRx(slackKey$$);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!slackCredentials.token || !slackCredentials.teamId) {
      toast.warning('Please enter a valid API Key and Team ID', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setIsChecking(true);
    const isValid = await validateSlackKey(slackCredentials.token, slackCredentials.teamId);
    setIsChecking(false);
    if (!isValid) {
      toast.error('Invalid API Key or Team ID', {
        position: 'top-center',
        duration: 3000,
      });
    }
  };

  return (
    <div className='flex flex-col gap-4 p-12 pt-2'>
      <TypographyH3>Slack</TypographyH3>
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='apiKey'>API Key</Label>
          <PasswordInput
            disabled={isChecking}
            onChange={e => setSlackCredentials({ ...slackCredentials, token: e.target.value })}
            value={slackCredentials.token}
            id='apiKey'
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='teamId'>Team ID</Label>
          <PasswordInput
            disabled={isChecking}
            id='teamId'
            value={slackCredentials.teamId}
            onChange={e => setSlackCredentials({ ...slackCredentials, teamId: e.target.value })}
          />
        </div>
        <Button disabled={isChecking} type='submit'>
          <>
            {isChecking && <Loader2Icon className='animate-spin' />}
            {isChecking ? 'Checking...' : 'Connect'}
          </>
        </Button>
      </form>
    </div>
  );
};
