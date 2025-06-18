import { openai } from '@ai-sdk/openai';
import { type Message, streamText, type ToolSet } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient } from '@mcp-server/slack';
import { TimeClient } from '@mcp-server/time';

export const maxDuration = 30;

type SlackTool = {
  name: string;
  token: string;
  teamId: string;
};

type CreateChatBody = {
  messages: Message[];
  enabledTools: SlackTool[];
};

const createTools = (param: SlackTool) => {
  if (param.name === 'slack') {
    const { token, teamId } = param;
    const slackClient = new SlackClient({
      token,
      slackTeamId: teamId,
    });

    return createAISDKTools(slackClient);
  }

  if (param.name === 'time') {
    const timeClient = new TimeClient();
    return createAISDKTools(timeClient);
  }

  return null;
};

function isTrue<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

export async function POST(req: Request) {
  const data = (await req.json()) as CreateChatBody;
  const { messages, enabledTools } = data;
  console.log(messages);
  const tools = enabledTools.map(createTools).filter(isTrue);
  const result = streamText({
    model: openai('gpt-4.1-nano-2025-04-14'),
    messages,
    tools: tools.reduce((acc, tool) => {
      return {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        ...acc,
        ...tool,
      };
    }, {} as ToolSet),
    onError: err => {
      console.error('Error occurred in /api/chat', err);
    },
  });

  return result.toDataStreamResponse();
}
