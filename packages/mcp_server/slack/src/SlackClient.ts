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
import ky, { type KyInstance } from 'ky';

export type SlackClientConfig = {
  token: string;
  slackTeamId: string;
  slackChannelIds?: string[];
};

export class SlackClient extends AIFunctionsProvider {
  private api: KyInstance;
  private slackTeamId: string;
  // for test
  private token: string;

  constructor({ token, slackTeamId }: SlackClientConfig) {
    assert(token, 'slack Token is required');
    assert(slackTeamId, 'slackTeamId is required');

    super();
    this.api = ky.create({
      prefixUrl: 'https://slack.com/api/',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    this.slackTeamId = slackTeamId;
    this.token = token;
  }

  public async getChannels(limit = 200, cursor?: string): Promise<GetSlackChannelsResponse> {
    const searchParams: Record<string, string> = {
      types: 'public_channel',
      exclude_archived: 'true',
      limit: limit.toString(),
      team_id: this.slackTeamId,
    };

    if (cursor) {
      searchParams.cursor = cursor;
    }

    const data = await this.api
      .get('conversations.list', {
        searchParams,
      })
      .json<GetSlackChannelsResponse>();

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
  async getAllChannels(): Promise<Omit<GetSlackChannelsResponse, 'response_metadata'>> {
    const allChannels$ = defer(() => this.getChannels()).pipe(
      expand(response => {
        if (response.ok && response.response_metadata.next_cursor) {
          return this.getChannels(200, response.response_metadata.next_cursor);
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
    };
  }

  @aiFunction({
    name: 'get_slack_channel_history',
    description: "Fetches a conversation's history of messages and events in specific channel.",
    inputSchema: GetChannelHistoryInputSchema,
  })
  async getChannelHistory({
    channel,
    limit = 30,
    cursor,
  }: z.infer<typeof GetChannelHistoryInputSchema>): Promise<SlackChannelHistoryResponse> {
    const searchParams: Record<string, string | number> = {
      channel,
      limit,
    };
    if (cursor) {
      searchParams.cursor = cursor;
    }

    const data = await this.api
      .get('conversations.history', { searchParams })
      .json<SlackChannelHistoryResponse>();

    return SlackChannelHistoryResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_thread_replies',
    description: 'Retrieve a thread of messages posted to a conversation',
    inputSchema: GetThreadRepliesInputSchema,
  })
  async getThreadReplies({
    channel,
    ts,
    limit = 10,
    cursor,
  }: z.infer<typeof GetThreadRepliesInputSchema>): Promise<SlackRepliesResponse> {
    const searchParams: Record<string, string | number> = {
      channel,
      ts,
      limit,
    };
    if (cursor) {
      searchParams.cursor = cursor;
    }
    const data = await this.api
      .get('conversations.replies', { searchParams })
      .json<SlackRepliesResponse>();

    if (!data.ok) {
      return { ok: false, error: data.error };
    }

    return SlackRepliesResponseSchema.parse(data);
  }

  public async getUsers(limit = 200, cursor?: string): Promise<GetUsersResponse> {
    const searchParams: Record<string, string> = {
      limit: limit.toString(),
      team_id: this.slackTeamId,
    };
    if (cursor) {
      searchParams.cursor = cursor;
    }
    const data = await this.api.get('users.list', { searchParams }).json<GetUsersResponse>();

    return GetUsersResponseSchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_users',
    description:
      'Get a list of ALL users in the Slack workspace. It does not return deleted users.',
    inputSchema: z.object({}).describe('No input is required.'),
  })
  async getAllUsers(): Promise<GetUsersResponse> {
    const allUsers$ = defer(() => this.getUsers()).pipe(
      expand(response => {
        if (response.ok && response.response_metadata?.next_cursor) {
          return this.getUsers(200, response.response_metadata?.next_cursor);
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
    const searchParams = {
      user: userId,
      include_labels: 'true',
    };
    const data = await this.api
      .get('users.profile.get', { searchParams })
      .json<GetUserProfileResponse>();

    if (!data.ok) {
      return {
        ok: false,
        // 이 API 를 단기간에 여러번 부르면 ratelimited 에러가 떠서 임시로 예외처리함.
        // @ts-expect-error
        reason: data.error,
      };
    }

    return GetUserProfileResponseSchema.parse(data);
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
    const data = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      body: JSON.stringify({
        channel,
        text,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await data.json();
    return PostMessageResponseSchema.parse(json);
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
      body: JSON.stringify({
        channel,
        thread_ts,
        text,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return PostMessageResponseSchema.parse(json);
  }

  @aiFunction({
    name: 'add_slack_reaction',
    description:
      'Adds a reaction (emoji) to a message in a slack channel.' +
      'You can use thumbsup, bow, cry, eyes',
    inputSchema: AddReactionInputSchema,
  })
  async postReaction({
    channel,
    timestamp,
    reaction,
  }: z.infer<typeof AddReactionInputSchema>): Promise<AddReactionResponse> {
    const response = await fetch('https://slack.com/api/reactions.add', {
      method: 'POST',
      body: JSON.stringify({
        channel,
        timestamp,
        name: reaction,
      }),
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return AddReactionResponseSchema.parse(json);
  }
}
