import { rx } from '@/lib/rxjs/rx';

export type SlackChannel = {
  channelName: string;
  channelId: string;
};

export const selectedSlackChannels$$ = rx<Array<SlackChannel>>([]);
