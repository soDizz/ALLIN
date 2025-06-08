import { describe, it, expect, beforeEach } from 'vitest';
import { SlackMCPServer } from '../index';
import dotenv from 'dotenv';
import { SlackClient } from 'src/SlackClient';

dotenv.config();

/**
 * important:
 * ** To run this test, you need to set the following environment variables. (`.env` file)
 * -   `SLACK_BOT_TOKEN`
 * -   `SLACK_TEAM_ID`
 * -   `__TEST_USER_ID`
 * -   `__TEST_CHANNEL_ID`
 * -   `__TEST_THREAD_TS`
 */
describe('SlackMCPServer', () => {
  it('should be defined', () => {
    expect(SlackMCPServer).toBeDefined();
  });

  it('if botToken or slackTeamId are empty, it should throw an error', () => {
    expect(() => new SlackMCPServer({ token: '', slackTeamId: 'test' })).toThrow();
    expect(() => new SlackMCPServer({ token: 'test', slackTeamId: '' })).toThrow();
    expect(() => new SlackMCPServer({ token: '', slackTeamId: '' })).toThrow();
  });

  describe('SlackBot API test', () => {
    let slackClient: SlackClient;
    let userId: string;
    let channelId: string;
    let threadTs: string;

    beforeEach(() => {
      if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_TEAM_ID) {
        throw new Error('SLACK_BOT_TOKEN and SLACK_TEAM_ID must be set');
      }

      if (
        !process.env.__TEST_USER_ID ||
        !process.env.__TEST_CHANNEL_ID ||
        !process.env.__TEST_THREAD_TS
      ) {
        throw new Error('__TEST_USER_ID, __TEST_CHANNEL_ID, __TEST_THREAD_TS must be set');
      }

      slackClient = new SlackClient({
        token: process.env.SLACK_BOT_TOKEN,
        slackTeamId: process.env.SLACK_TEAM_ID,
      });

      userId = process.env.__TEST_USER_ID;
      channelId = process.env.__TEST_CHANNEL_ID;
      threadTs = process.env.__TEST_THREAD_TS;
    });

    it('should be able to get channels', async () => {
      const response = await slackClient.getChannels();
      expect(response.ok).toBe(true);
    });

    it('should be able to get users', async () => {
      const response = await slackClient.getAllUsers();
      expect(response.ok).toBe(true);
    });

    it('should be able to get user profile', async () => {
      const response = await slackClient.getUserProfile({ userId });
      expect(response.ok).toBe(true);
    });

    it('should be able to get channel history', async () => {
      const response = await slackClient.getChannelHistory({ channel: channelId, limit: 100 });
      expect(response.ok).toBe(true);
    });

    it('should be able to get thread replies', async () => {
      const response = await slackClient.getThreadReplies({
        channel: channelId,
        ts: threadTs,
        limit: 100,
      });
      expect(response.ok).toBe(true);
    });
  });
});
