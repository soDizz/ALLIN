import { openai } from '@ai-sdk/openai';
import { type Message, streamText, type ToolSet } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient } from '@mcp-server/slack';
import { TimeClient } from '@mcp-server/time';
import { decryptData } from '@/lib/crypo';

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
    const { token: encryptedToken, teamId } = param;
    const KEY = process.env.CIPHER_KEY;
    if (!KEY) {
      throw Error('NO KEY');
    }
    const token = decryptData(encryptedToken, KEY);
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
  const tools = enabledTools ? enabledTools.map(createTools).filter(isTrue) : undefined;

  const result = streamText({
    model: openai('gpt-4.1'),
    messages,
    tools: tools?.reduce((acc, tool) => {
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
