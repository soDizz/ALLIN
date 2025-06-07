import { describe, it, expect } from 'vitest';
import { SlackMCPServer } from '../index';
import dotenv from 'dotenv';
import { SlackClient } from 'src/SlackClient';
import { inspect } from 'node:util';

dotenv.config();

describe('SlackMCPServer', () => {
  it('should be defined', () => {
    expect(SlackMCPServer).toBeDefined();
  });

  it('if botToken or slackTeamId are empty, it should throw an error', () => {
    expect(() => new SlackMCPServer({ token: '', slackTeamId: 'test' })).toThrow();
    expect(() => new SlackMCPServer({ token: 'test', slackTeamId: '' })).toThrow();
    expect(() => new SlackMCPServer({ token: '', slackTeamId: '' })).toThrow();
  });

  it('if botToken and slackTeamId are provided, it should not throw an error', async () => {
    const token = process.env.SLACK_BOT_TOKEN;
    const slackTeamId = process.env.SLACK_TEAM_ID;

    if (!token || !slackTeamId) {
      throw new Error('SLACK_BOT_TOKEN and SLACK_TEAM_ID must be set');
    }

    const slackClient = new SlackClient({ token, slackTeamId });
    // 인터렉션 채널 id: C08L5KUGQKX
    const response1 = await slackClient.getChannelHistory({
      channel_id: 'C08L5KUGQKX',
    });
    console.log(inspect(response1, { depth: null, colors: true }));
  });
});
