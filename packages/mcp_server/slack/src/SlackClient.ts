import { aiFunction, AIFunctionsProvider, assert } from '@agentic/core';
import {
  AddReactionInputSchema,
  type AddReactionResponse,
  AddReactionResponseSchema,
  GetChannelHistoryInputSchema,
  GetSlackChannelsInputSchema,
  type GetSlackChannelsResponse,
  GetSlackChannelsResponseSchema,
  GetThreadRepliesInputSchema,
  GetUserProfileInputSchema,
  type GetUserProfileResponse,
  GetUserProfileResponseSchema,
  type GetUsersResponse,
  GetUsersResponseSchema,
  PostMessageInputSchema,
  type PostMessageResponse,
  PostMessageResponseSchema,
  ReplyToThreadInputSchema,
  type SlackChannel,
  type SlackChannelHistoryResponse,
  SlackChannelHistoryResponseSchema,
  type SlackRepliesResponse,
  SlackRepliesResponseSchema,
  type SlackUser,
} from './slack';
import z from 'zod';
import { defer, EMPTY, expand, filter, lastValueFrom, map, reduce } from 'rxjs';

export type SlackClientConfig = {
  token: string;
  slackTeamId: string;
  slackChannelIds?: string[];
};

export class SlackClient extends AIFunctionsProvider {
  private headers: { Authorization: string; 'Content-Type': string };
  private slackTeamId: string;

  constructor({ token, slackTeamId }: SlackClientConfig) {
    assert(token, 'slack Token is required');
    assert(slackTeamId, 'slackTeamId is required');

    super();
    this.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    this.slackTeamId = slackTeamId;
  }

  private async _fetchChannelsPage(cursor?: string): Promise<GetSlackChannelsResponse> {
    const params = new URLSearchParams({
      types: 'public_channel',
      exclude_archived: 'true',
      limit: '200',
      team_id: this.slackTeamId,
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.list?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error);
    }

    return GetSlackChannelsResponseSchema.parse(data);
  }

  /**
   * It returns a list of ALL channels that the current user is a member of.
   */
  @aiFunction({
    name: 'get_slack_channels_for_current_user',
    description:
      'Get a list of public channels in the Slack workspace.' +
      'It returns all channels that the current user is a member of.',
    inputSchema: GetSlackChannelsInputSchema,
  })
  async getChannels(): Promise<GetSlackChannelsResponse> {
    const allChannels$ = defer(() => this._fetchChannelsPage()).pipe(
      expand(response => {
        if (response.ok && response.response_metadata.next_cursor) {
          return this._fetchChannelsPage(response.response_metadata.next_cursor);
        }
        return EMPTY;
      }),
      map(response => response.channels as SlackChannel[]),
      reduce<SlackChannel[], SlackChannel[]>(
        (allChannels, pageChannels) => allChannels.concat(pageChannels),
        [],
      ),
    );

    const allChannels = await lastValueFrom(allChannels$);

    return {
      ok: true,
      channels: allChannels.filter(channel => channel.is_member),
      response_metadata: { next_cursor: '' },
    };
  }

  @aiFunction({
    name: 'send_slack_message',
    description: 'Sends a message to a public slack channel.',
    inputSchema: PostMessageInputSchema,
  })
  async postMessage({
    channel,
    text,
  }: z.infer<typeof PostMessageInputSchema>): Promise<PostMessageResponse> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel,
        text: text,
      }),
    });

    const data = await response.json();
    return PostMessageResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'reply_to_slack_thread',
    description: 'Sends a reply to a specific thread in a public slack channel.',
    inputSchema: ReplyToThreadInputSchema,
  })
  async postReply({
    channel,
    thread_ts,
    text,
  }: z.infer<typeof ReplyToThreadInputSchema>): Promise<PostMessageResponse> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel,
        thread_ts: thread_ts,
        text: text,
      }),
    });

    const data = await response.json();
    return PostMessageResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'add_slack_reaction',
    description:
      'Adds a reaction (emoji) to a message in a slack channel.' +
      'You can use thumbsup, bow, cry, eyes',
    inputSchema: AddReactionInputSchema,
  })
  async addReaction({
    channel,
    timestamp,
    reaction,
  }: z.infer<typeof AddReactionInputSchema>): Promise<AddReactionResponse> {
    const response = await fetch('https://slack.com/api/reactions.add', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel,
        timestamp: timestamp,
        name: reaction,
      }),
    });

    const data = await response.json();
    return AddReactionResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_channel_history',
    description: "Fetches a conversation's history of messages and events.",
    inputSchema: GetChannelHistoryInputSchema,
  })
  async getChannelHistory({
    channel,
    limit = 30,
    cursor,
  }: z.infer<typeof GetChannelHistoryInputSchema>): Promise<SlackChannelHistoryResponse> {
    const params = new URLSearchParams({
      channel: channel,
      limit: limit.toString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.history?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return SlackChannelHistoryResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_thread_replies',
    description: 'Fetches replies to a message thread.',
    inputSchema: GetThreadRepliesInputSchema,
  })
  async getThreadReplies({
    channel,
    ts,
    limit = 10,
    cursor,
  }: z.infer<typeof GetThreadRepliesInputSchema>): Promise<SlackRepliesResponse> {
    const params = new URLSearchParams({
      channel: channel,
      ts: ts,
      // limit: limit.toString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.replies?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return SlackRepliesResponseSchema.parse(data);
  }

  private async _fetchUsersPage(cursor?: string): Promise<GetUsersResponse> {
    const params = new URLSearchParams({
      limit: '200',
      team_id: this.slackTeamId,
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/users.list?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return GetUsersResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_users',
    description:
      'Get a list of ALL users in the Slack workspace. It does not return deleted users.',
    inputSchema: z.object({}).describe('No input is required.'),
  })
  async getAllUsers(): Promise<GetUsersResponse> {
    const allUsers$ = defer(() => this._fetchUsersPage()).pipe(
      expand(response => {
        if (response.ok && response.response_metadata?.next_cursor) {
          return this._fetchUsersPage(response.response_metadata?.next_cursor);
        }
        return EMPTY;
      }),
      map(response => response.members as SlackUser[]),
      filter(users => !users.some(user => user.deleted)),
      reduce<SlackUser[], SlackUser[]>((allUsers, pageUsers) => allUsers.concat(pageUsers), []),
    );

    const allUsers = await lastValueFrom(allUsers$);

    return {
      ok: true,
      members: allUsers,
    };
  }

  @aiFunction({
    name: 'get_slack_user_profile',
    description: 'Get a user profile in the Slack workspace.',
    inputSchema: GetUserProfileInputSchema,
  })
  async getUserProfile({
    userId,
  }: z.infer<typeof GetUserProfileInputSchema>): Promise<GetUserProfileResponse> {
    const params = new URLSearchParams({
      user: userId,
      include_labels: 'true',
    });

    const response = await fetch(`https://slack.com/api/users.profile.get?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return GetUserProfileResponseSchema.parse(data);
  }
}
