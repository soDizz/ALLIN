import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { useRxValue } from '@/lib/rxjs/useRx';
import { Eye, EyeOff } from 'lucide-react';
import { use, useContext, useMemo, useState } from 'react';
import { SlackChannelSelect } from './SlackChannelSelect';
import { ToolManager } from '@/app/tools/ToolManager';
import { ToolManagerContext } from '@/app/tools/ToolManagerContext';

export const SlackSettingView = () => {
  const toolManager = useContext(ToolManagerContext);
  const slackTool = useMemo(() => toolManager.getTool('slack'), [toolManager]);
  const isActive = useRxValue(slackTool.isActive$, slackTool.isActive);
  const cert = useRxValue(slackTool.cert$, slackTool.cert);

  const [isAPIKeyVisible, setIsAPIKeyVisible] = useState(false);
  const [isTeamIDVisible, setIsTeamIDVisible] = useState(false);

  const deleteSlackKey = () => {
    slackTool.setIsActive(false);
    slackTool.setIsVerified(false);
    slackTool.setCert({
      API_KEY: '',
      WORKSPACE_ID: '',
    });
    slackTool.setPointedChannels([]);
  };

  const onChange = (checked: boolean) => {
    slackTool.setIsActive(checked);
  };

  return (
    <div className='flex flex-col gap-4 px-4 grow'>
      <SlackChannelSelect />
      <p className='text-lg'>Settings</p>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Active</Label>
          <p className='text-xs text-muted-foreground'>
            Model can use Slack API
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={onChange}
          id='slack-active-status'
        />
      </div>

      {/* <p className='text-lg'>Status</p>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Active</Label>
          <p className='text-xs text-muted-foreground'>Model can use Slack API if active.</p>
        </div>
        <Switch checked={slackPlugin.active} onCheckedChange={onChange} id='slack-active-status' />
      </div> */}

      <p className='text-lg mt-4'>Private Zone</p>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Your API Token</Label>
          <p className='text-xs text-muted-foreground break-words'>
            {isAPIKeyVisible ? cert.API_KEY : '********'}
          </p>
        </div>
        <Toggle onClick={() => setIsAPIKeyVisible(!isAPIKeyVisible)}>
          {isAPIKeyVisible ? (
            <Eye className='w-4 h-4' />
          ) : (
            <EyeOff className='w-4 h-4' />
          )}
        </Toggle>
      </div>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Your Team ID</Label>
          <p className='text-xs text-muted-foreground'>
            {isTeamIDVisible ? cert.WORKSPACE_ID : '********'}
          </p>
        </div>
        <Toggle onClick={() => setIsTeamIDVisible(!isTeamIDVisible)}>
          {isTeamIDVisible ? (
            <Eye className='w-4 h-4' />
          ) : (
            <EyeOff className='w-4 h-4' />
          )}
        </Toggle>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            className='w-full mt-auto mb-6 text-red-500 border-red-500 hover:bg-red-500 hover:text-white'
          >
            Clear Slack API Token
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your Slack Key. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSlackKey}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
