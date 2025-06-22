import { type NextRequest, NextResponse } from 'next/server';
import { SlackClient } from '@mcp-server/slack';
import { decryptData } from '@/lib/crypo';

export type SlackValidateBodyParams = {
  token: string;
  workspaceId: string;
};

export async function POST(request: NextRequest) {
  try {
    const { token: encryptedToken, workspaceId } =
      (await request.json()) as SlackValidateBodyParams;
    const KEY = process.env.CIPHER_KEY;
    if (!encryptedToken || !workspaceId || !KEY) {
      return NextResponse.json({ error: 'Token and Team ID are required' }, { status: 400 });
    }

    const token = decryptData(encryptedToken, KEY);
    const client = new SlackClient({
      token,
      slackTeamId: workspaceId,
    });

    const data = await client.getChannels(1);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Slack validation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
