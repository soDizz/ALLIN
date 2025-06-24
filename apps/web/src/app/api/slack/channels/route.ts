import { decryptData } from '@/lib/crypo';
import { SlackClient } from '@mcp-server/slack';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const encryptedToken = req.headers?.get('authorization')?.split(' ')[1];
  const KEY = process.env.CIPHER_KEY;

  const workspaceId = req.nextUrl.searchParams.get('workspaceId');

  if (!encryptedToken || !workspaceId || !KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = decryptData(encryptedToken, KEY);
  const client = new SlackClient({
    token,
    slackTeamId: workspaceId,
  });

  const res = await client.getAllChannels();

  return NextResponse.json(res.channels);
}
