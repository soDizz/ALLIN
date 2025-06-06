export type SlackClientConfig = {
  botToken: string;
  slackTeamId: string;
  slackChannelIds?: string[];
};

export class SlackClient {
  private botHeaders: { Authorization: string; 'Content-Type': string };
  private slackChannelIds: string[];
  private slackTeamId: string;

  constructor({ botToken, slackTeamId, slackChannelIds }: SlackClientConfig) {
    if (!botToken || !slackTeamId) {
      throw new Error('botToken and slackTeamId are required');
    }

    this.botHeaders = {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json',
    };
    this.slackChannelIds = slackChannelIds || [];
    this.slackTeamId = slackTeamId;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getChannels(
    limit = 100,
    cursor?: string,
  ): Promise<{
    ok: boolean;
    channels: Array<{
      id: string;
      name: string;
      creator: string;
      is_member: boolean;
    }>;
    response_metadata: {
      next_cursor: string;
    };
  }> {
    if (this.slackChannelIds.length === 0) {
      const params = new URLSearchParams({
        types: 'public_channel',
        exclude_archived: 'true',
        limit: Math.min(limit, 200).toString(),
        team_id: this.slackTeamId,
      });

      if (cursor) {
        params.append('cursor', cursor);
      }
      const response = await fetch(`https://slack.com/api/conversations.list?${params}`, { headers: this.botHeaders });
      return response.json();
    }

    const predefinedChannelIdsArray = this.slackChannelIds.map((id: string) => id.trim());
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const channels: any[] = [];

    for (const channelId of predefinedChannelIdsArray) {
      const params = new URLSearchParams({
        channel: channelId,
      });

      const response = await fetch(`https://slack.com/api/conversations.info?${params}`, { headers: this.botHeaders });
      const data = await response.json();

      if (data.ok && data.channel && !data.channel.is_archived) {
        channels.push(data.channel);
      }
    }

    return {
      ok: true,
      channels: channels,
      response_metadata: { next_cursor: '' },
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async postMessage(channel_id: string, text: string): Promise<any> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: this.botHeaders,
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
      headers: this.botHeaders,
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
      headers: this.botHeaders,
      body: JSON.stringify({
        channel: channel_id,
        timestamp: timestamp,
        name: reaction,
      }),
    });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getChannelHistory(channel_id: string, limit = 10): Promise<any> {
    const params = new URLSearchParams({
      channel: channel_id,
      limit: limit.toString(),
    });

    const response = await fetch(`https://slack.com/api/conversations.history?${params}`, { headers: this.botHeaders });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getThreadReplies(channel_id: string, thread_ts: string): Promise<any> {
    const params = new URLSearchParams({
      channel: channel_id,
      ts: thread_ts,
    });

    const response = await fetch(`https://slack.com/api/conversations.replies?${params}`, { headers: this.botHeaders });

    return response.json();
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
      headers: this.botHeaders,
    });

    return response.json();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async getUserProfile(user_id: string): Promise<any> {
    const params = new URLSearchParams({
      user: user_id,
      include_labels: 'true',
    });

    const response = await fetch(`https://slack.com/api/users.profile.get?${params}`, { headers: this.botHeaders });

    return response.json();
  }
}
