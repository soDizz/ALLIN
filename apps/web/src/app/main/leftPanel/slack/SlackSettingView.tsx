import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { plugins } from '../../store/pluginsStore';
import { useRx } from '@/lib/rxjs/useRx';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { slackKey$$ } from '../../store/slackKey';
import { useState } from 'react';
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
import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY } from '../../localStorageKey';
import { SlackChannelSelect } from './SlackChannelSelect';

export const SlackSettingView = () => {
  const [slackPlugin, setSlackPlugin] = useRx(plugins.slack$$);
  const [{ token, teamId }, setSlackKey] = useRx(slackKey$$);
  const [isAPIKeyVisible, setIsAPIKeyVisible] = useState(false);
  const [isTeamIDVisible, setIsTeamIDVisible] = useState(false);
  const [, , removeSlackKey] = useLocalStorage(LOCAL_STORAGE_KEY.SLACK, {
    token: '',
    teamId: '',
  });

  const deleteSlackKey = () => {
    setSlackPlugin(prev => ({
      ...prev,
      active: false,
      verified: false,
    }));
    setSlackKey({
      token: '',
      teamId: '',
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
          <p className='text-xs text-muted-foreground'>{isAPIKeyVisible ? token : '********'}</p>
        </div>
        <Toggle onClick={() => setIsAPIKeyVisible(!isAPIKeyVisible)}>
          {isAPIKeyVisible ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
        </Toggle>
      </div>
      <div className='flex w-full items-center justify-between rounded-lg border p-3 shadow-xs gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Label htmlFor='slack-active-status'>Your Team ID</Label>
          <p className='text-xs text-muted-foreground'>{isTeamIDVisible ? teamId : '********'}</p>
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
