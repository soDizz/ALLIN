import { NextResponse } from 'next/server';
import { SlackClient } from '@mcp-server/slack';

export async function POST(request: Request) {
  try {
    const { token, teamId } = await request.json();

    if (!token || !teamId) {
      return NextResponse.json({ error: 'Token and Team ID are required' }, { status: 400 });
    }

    const client = new SlackClient({
      token,
      slackTeamId: teamId,
    });

    const data = await client.getChannels();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Slack validation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
