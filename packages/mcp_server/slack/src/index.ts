import { z } from 'zod';
import { type Tool, tool } from 'ai';
import { SlackClient, type SlackClientConfig } from './SlackClient';

export { SlackClient };

export class SlackMCPServer {
  private slackClient: SlackClient;

  constructor(private readonly slackClientConfig: SlackClientConfig) {
    this.slackClient = new SlackClient(slackClientConfig);
  }

  public get listChannelsTool(): Tool {
    return tool({
      description: 'List public or pre-defined channels in the workspace with pagination',
      parameters: z.object({
        limit: z
          .number()
          .describe('Maximum number of channels to return (default 100, max 200)')
          .default(100),
        cursor: z.string().describe('Pagination cursor for next page of results'),
      }),
      execute: async ({ limit, cursor }) => {
        const response = await this.slackClient.getChannels({ limit, cursor });
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get postMessageTool(): Tool {
    return tool({
      description: 'Post a new message to a Slack channel',
      parameters: z.object({
        channel_id: z.string().describe('The ID of the channel to post to'),
        text: z.string().describe('The message text to post'),
      }),
      execute: async ({ channel_id, text }) => {
        const response = await this.slackClient.postMessage(channel_id, text);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get replyToThreadTool(): Tool {
    return tool({
      description: 'Reply to a specific message thread in Slack',
      parameters: z.object({
        channel_id: z.string().describe('The ID of the channel containing the thread'),
        thread_ts: z
          .string()
          .describe(
            "The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it.",
          ),
        text: z.string().describe('The reply text'),
      }),
      execute: async ({ channel_id, thread_ts, text }) => {
        const response = await this.slackClient.postReply(channel_id, thread_ts, text);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get addReactionTool(): Tool {
    return tool({
      description: 'Add a reaction emoji to a message',
      parameters: z.object({
        channel_id: z.string().describe('The ID of the channel containing the message'),
        timestamp: z.string().describe('The timestamp of the message to react to'),
        reaction: z.string().describe('The name of the emoji reaction (without ::)'),
      }),
      execute: async ({ channel_id, timestamp, reaction }) => {
        const response = await this.slackClient.addReaction(channel_id, timestamp, reaction);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get getChannelHistoryTool(): Tool {
    return tool({
      description: 'Get recent messages from a channel',
      parameters: z.object({
        channel_id: z.string().describe('The ID of the channel'),
        limit: z.number().describe('Number of messages to retrieve (default 10)').default(10),
      }),
      execute: async ({ channel_id, limit }) => {
        const response = await this.slackClient.getChannelHistory({ channel_id, limit });
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get getThreadRepliesTool(): Tool {
    return tool({
      description: 'Get all replies in a message thread',
      parameters: z.object({
        channel_id: z.string().describe('The ID of the channel containing the thread'),
        thread_ts: z
          .string()
          .describe(
            "The timestamp of the parent message in the format '1234567890.123456'. Timestamps in the format without the period can be converted by adding the period such that 6 numbers come after it.",
          ),
      }),
      execute: async ({ channel_id, thread_ts }) => {
        const response = await this.slackClient.getThreadReplies(channel_id, thread_ts);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get getUsersTool(): Tool {
    return tool({
      description: 'Get a list of all users in the workspace with their basic profile information',
      parameters: z.object({
        cursor: z.string().describe('Pagination cursor for next page of results'),
        limit: z
          .number()
          .describe('Maximum number of users to return (default 100, max 200)')
          .default(100),
      }),
      execute: async ({ cursor, limit }) => {
        const response = await this.slackClient.getUsers(limit, cursor);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }

  public get getUserProfileTool(): Tool {
    return tool({
      description: 'Get detailed profile information for a specific user',
      parameters: z.object({
        user_id: z.string().describe('The ID of the user'),
      }),
      execute: async ({ user_id }) => {
        const response = await this.slackClient.getUserProfile(user_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(response) }],
        };
      },
    });
  }
}
