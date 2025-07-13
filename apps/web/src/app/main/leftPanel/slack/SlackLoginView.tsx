import ky from 'ky';
import { Loader2Icon } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { SlackValidateBodyParams } from '@/app/api/slack/validate/route';
import { ToolManager } from '@/app/tools/ToolManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SlackGuide } from './SlackGuide';

export const SlackLoginView = () => {
  const [isChecking, setIsChecking] = useState(false);
  const slackTool = useMemo(
    () => ToolManager.getInstance().getTool('slack'),
    [],
  );
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    const workspaceId = formData.get('workspaceId') as string;

    if (!token || !workspaceId) {
      toast.warning('Please enter a valid API Key and Team ID', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setIsChecking(true);

    try {
      const { encrypted: encryptedToken } = await ky
        .post('/api/cipher', {
          json: {
            token,
          },
        })
        .json<{ encrypted: string }>();

      await ky.post('/api/slack/validate', {
        json: {
          token: encryptedToken,
          workspaceId,
        } as SlackValidateBodyParams,
      });

      slackTool.setCert({
        API_KEY: encryptedToken,
        WORKSPACE_ID: workspaceId,
      });

      slackTool.setIsActive(true);
      slackTool.setIsVerified(true);

      toast.success('Slack connected successfully!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error(error);
      toast.error('Invalid API Key or Team ID', {
        position: 'top-center',
      });
    } finally {
      setIsChecking(false);
    }
  };
  return (
    <>
      <form className='flex flex-col gap-4 p-6' onSubmit={onSubmit}>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='token'>API Token</Label>
          <Input disabled={isChecking} id='token' name='token' />
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='workspaceId'>Workspace ID</Label>
          <Input disabled={isChecking} id='workspaceId' name='workspaceId' />
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
