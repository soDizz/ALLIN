import { openai } from '@ai-sdk/openai';
import { type Message, streamText } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient } from '@mcp-server/slack';

export const maxDuration = 30;

type SlackTool = {
  name: string;
  key: string;
  teamId: string;
};

type CreateChatBody = {
  messages: Message[];
  enabledTools: SlackTool[];
};

const createSlackTools = (param: SlackTool) => {
  const { key, teamId } = param;
  const slackClient = new SlackClient({
    token: key,
    slackTeamId: teamId,
  });

  return createAISDKTools(slackClient);
};

export async function POST(req: Request) {
  const data = (await req.json()) as CreateChatBody;
  const { messages, enabledTools } = data;

  const tools = enabledTools.map(createSlackTools);

  const result = streamText({
    model: openai('gpt-4.1-nano-2025-04-14'),
    messages,
    tools: tools.reduce((acc, tool) => {
      return {
        ...acc,
        ...tool,
      };
    }, {}),
  });

  return result.toDataStreamResponse();
}
