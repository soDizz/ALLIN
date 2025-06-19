import { rx } from '@/lib/rxjs/rx';

export type Slack = {
  token: string;
  workspaceId: string;
  selectedChannels: Array<{
    channelId: string,
    channelName: string,
  }>
}

export const slack$$ = rx<Slack>({
  token: '',
  workspaceId: '',
  selectedChannels: []
});
