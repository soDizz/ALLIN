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
import { useRx } from '@/lib/rxjs/useRx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY, type LocalStorageData } from '../../localStorageKey';
import { slack$$ } from '../../store/slackStore';
import { toolsStatus } from '../../store/toolsStatusStore';
import { SlackChannelSelect } from './SlackChannelSelect';

export const SlackSettingView = () => {
  const [slackPlugin, setSlackPlugin] = useRx(toolsStatus.slack$$);
  const [{ token, workspaceId }, setSlackKey] = useRx(slack$$);
  const [isAPIKeyVisible, setIsAPIKeyVisible] = useState(false);
  const [isTeamIDVisible, setIsTeamIDVisible] = useState(false);
  const [, , removeSlackKey] = useLocalStorage<LocalStorageData['slack']>(LOCAL_STORAGE_KEY.SLACK, {
    token: '',
    workspaceId: '',
    selectedChannels: [],
  });

  const deleteSlackKey = () => {
    setSlackPlugin(prev => ({
      ...prev,
      active: false,
      verified: false,
    }));
    setSlackKey({
      token: '',
      workspaceId: '',
      selectedChannels: [],
    });
    removeSlackKey();
  };

  const onChange = (checked: boolean) => {
    setSlackPlugin(prev => ({
      ...prev,
      active: checked,
    }));
  };

  return (
    <div className='flex flex-col gap-4 px-4 grow'>
      <SlackChannelSelect />
      <p className='text-lg'>Settings</p>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Active</Label>
          <p className='text-xs text-muted-foreground'>Model can use Slack API</p>
        </div>
        <Switch checked={slackPlugin.active} onCheckedChange={onChange} id='slack-active-status' />
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
            {isAPIKeyVisible ? token : '********'}
          </p>
        </div>
        <Toggle onClick={() => setIsAPIKeyVisible(!isAPIKeyVisible)}>
          {isAPIKeyVisible ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
        </Toggle>
      </div>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Your Team ID</Label>
          <p className='text-xs text-muted-foreground'>
            {isTeamIDVisible ? workspaceId : '********'}
          </p>
        </div>
        <Toggle onClick={() => setIsTeamIDVisible(!isTeamIDVisible)}>
          {isTeamIDVisible ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
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
              This will permanently delete your Slack Key. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSlackKey}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
