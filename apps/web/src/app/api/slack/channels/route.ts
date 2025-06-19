import { SlackClient } from '@mcp-server/slack';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers?.get('authorization')?.split(' ')[1];
  const workspaceId = req.nextUrl.searchParams.get('workspaceId');

  if (!token || !workspaceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const client = new SlackClient({
    token,
    slackTeamId: workspaceId,
  });

  const res = await client.getAllChannels();

  return NextResponse.json(res.channels);
}
