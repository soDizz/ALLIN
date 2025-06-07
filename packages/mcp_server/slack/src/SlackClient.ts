import { aiFunction, AIFunctionsProvider, assert } from '@agentic/core';
import {
  type GetSlackChannelsResponse,
  GetSlackChannelsResponseSchema,
  type SlackChannelHistoryResponse,
  SlackChannelHistorySchema,
  type SlackRepliesResponse,
  SlackRepliesSchema,
} from './slack';
import z from 'zod';

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

  @aiFunction({
    name: 'get_slack_channels',
    description: 'Get slack channels',
    inputSchema: z.object({
      limit: z
        .number()
        .describe('Maximum number of channels to return (default 100, max 200)')
        .default(100),
      cursor: z.string().optional().describe('Cursor to start from (default: empty)'),
    }),
  })
  async getChannels({
    limit = 100,
    cursor,
  }: { limit?: number; cursor?: string }): Promise<GetSlackChannelsResponse> {
    const params = new URLSearchParams({
      types: 'public_channel',
      exclude_archived: 'true',
      limit: Math.min(limit, 200).toString(),
      team_id: this.slackTeamId,
    });

    if (cursor) {
      params.append('cursor', cursor);
    }
    const response = await fetch(`https://slack.com/api/conversations.list?${params}`, {
      headers: this.headers,
    });
    const data = await response.json();
    return GetSlackChannelsResponseSchema.parse(data);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async postMessage(channel_id: string, text: string): Promise<any> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel_id,
        text: text,
      }),
    });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async postReply(channel_id: string, thread_ts: string, text: string): Promise<any> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel_id,
        thread_ts: thread_ts,
        text: text,
      }),
    });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async addReaction(channel_id: string, timestamp: string, reaction: string): Promise<any> {
    const response = await fetch('https://slack.com/api/reactions.add', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        channel: channel_id,
        timestamp: timestamp,
        name: reaction,
      }),
    });

    return response.json();
  }

  /**
   * @param channel_id - The ID of the channel to get the history for.
   * @param limit - The maximum number of items to return (default 10, max 100).
   * @param cursor - The cursor to start from (default: empty).
   * @returns The messages of the channel.
   */
  @aiFunction({
    name: 'get_slack_channel_history',
    description: 'Get the history(messages) of a specific slack channel',
    inputSchema: z.object({
      channel_id: z.string().describe('The ID of the channel to get the history for'),
      limit: z
        .number()
        .describe('The maximum number of items to return (default 30, max 100)')
        .default(30),
      cursor: z.string().optional().describe('The cursor to start from (default: empty)'),
    }),
  })
  async getChannelHistory({
    channel_id,
    limit = 30,
    cursor,
  }: {
    channel_id: string;
    limit?: number;
    cursor?: string;
  }): Promise<SlackChannelHistoryResponse> {
    const params = new URLSearchParams({
      channel: channel_id,
      limit: limit.toString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.history?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return SlackChannelHistorySchema.parse(data);
  }

  @aiFunction({
    name: 'get_slack_thread_replies',
    description: 'Get the replies of a specific slack thread',
    inputSchema: z.object({
      channel_id: z.string().describe('The ID of the channel to get the replies for'),
      thread_ts: z.string().describe('The timestamp of the thread to get the replies for'),
      limit: z
        .number()
        .describe('The maximum number of items to return (default 10, max 100)')
        .default(10),
      cursor: z.string().optional().describe('The cursor to start from (default: empty)'),
    }),
  })
  async getThreadReplies({
    channel_id,
    thread_ts,
    limit = 10,
    cursor,
  }: {
    channel_id: string;
    thread_ts: string;
    limit?: number;
    cursor?: string;
  }): Promise<SlackRepliesResponse> {
    const params = new URLSearchParams({
      channel: channel_id,
      ts: thread_ts,
      limit: limit.toString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.replies?${params}`, {
      headers: this.headers,
    });

    const data = await response.json();
    return SlackRepliesSchema.parse(data);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getUsers(limit = 100, cursor?: string): Promise<any> {
    const params = new URLSearchParams({
      limit: Math.min(limit, 200).toString(),
      team_id: this.slackTeamId,
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/users.list?${params}`, {
      headers: this.headers,
    });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getUserProfile(user_id: string): Promise<any> {
    const params = new URLSearchParams({
      user: user_id,
      include_labels: 'true',
    });

    const response = await fetch(`https://slack.com/api/users.profile.get?${params}`, {
      headers: this.headers,
    });

    return response.json();
  }
}
