import type { SlackToolServerPayload } from '@/app/tools/slack/SlackTool';
import { decryptData } from '@/lib/crypo';
import { assert } from '@agentic/core';
import { SlackClient } from '@mcp-server/slack';

export const generateSlackClient = (param: SlackToolServerPayload) => {
  const decryptKey = process.env.CIPHER_KEY;
  const { cert, pointedChannels } = param;

  assert(decryptKey);
  assert(cert);

  const token = decryptData(cert.API_KEY, decryptKey);

  return new SlackClient({
    token,
    slackTeamId: cert.WORKSPACE_ID,
  });
};
