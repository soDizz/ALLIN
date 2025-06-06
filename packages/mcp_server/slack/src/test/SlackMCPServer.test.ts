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
    expect(() => new SlackMCPServer({ botToken: '', slackTeamId: 'test' })).toThrow();
    expect(() => new SlackMCPServer({ botToken: 'test', slackTeamId: '' })).toThrow();
    expect(() => new SlackMCPServer({ botToken: '', slackTeamId: '' })).toThrow();
  });

  it('if botToken and slackTeamId are provided, it should not throw an error', async () => {
    const botToken = process.env.SLACK_BOT_TOKEN;
    const slackTeamId = process.env.SLACK_TEAM_ID;

    if (!botToken || !slackTeamId) {
      throw new Error('SLACK_BOT_TOKEN and SLACK_TEAM_ID must be set');
    }

    const slackClient = new SlackClient({ botToken, slackTeamId });

    // {
    //     id: 'C08L5KUGQKX',
    //     name: '인터렉션-좋아요',
    //     is_channel: true,
    //     is_group: false,
    //     is_im: false,
    //     is_mpim: false,
    //     is_private: false,
    //     created: 1743501950,
    //     is_archived: false,
    //     is_general: false,
    //     unlinked: 0,
    //     name_normalized: '인터렉션-좋아요',
    //     is_shared: false,
    //     is_org_shared: false,
    //     is_pending_ext_shared: false,
    //     pending_shared: [],
    //     context_team_id: 'T04HSP44K',
    //     updated: 1746661696861,
    //     parent_conversation: null,
    //     creator: 'U047A2WSSG1',
    //     is_ext_shared: false,
    //     shared_team_ids: [ 'T04HSP44K' ],
    //     pending_connected_team_ids: [],
    //     is_member: true,
    //     topic: { value: '', creator: '', last_set: 0 },
    //     purpose: {
    //       value: '인터렉션관련 리소스, 레퍼런스 공유하면서 영감받는채널',
    //       creator: 'U047A2WSSG1',
    //       last_set: 1743502054
    //     },
    //     properties: {
    //       tabs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    //       tabz: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
    //     },
    //     previous_names: [],
    //     num_members: 6
    //   }

    const response1 = await slackClient.getChannels(100, 'dGVhbTpDMDhHM0I4MkozRQ==');
    const { channels, response_metadata } = response1;

    console.log(response_metadata);
    const target = channels.find(channel => {
      console.log(channel.name);
      return channel.name.includes('인터렉션');
    });

    console.log(target);

    // const response2 = await slackClient.getChannelHistory(100, response1.response_metadata.next_cursor);
  });
});
