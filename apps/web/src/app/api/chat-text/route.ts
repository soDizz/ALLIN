import { openai } from '@ai-sdk/openai';
import { type Message, streamText, type ToolSet } from 'ai';
import { createAISDKTools } from '@agentic/ai-sdk';
import { SlackClient } from '@mcp-server/slack';
import { TimeClient } from '@mcp-server/time';
import { decryptData } from '@/lib/crypo';
import { ExaClient } from '@mcp-server/exa';
import { assert } from '@agentic/core';

export const maxDuration = 30;

type Tool = {
  name: string;
  token?: string;
  teamId?: string;
};

type CreateChatBody = {
  messages: Message[];
  enabledTools?: Tool[];
};

const toolFactory = (param: Tool) => {
  if (param.name === 'slack') {
    const { token: encryptedToken, teamId } = param;
    const KEY = process.env.CIPHER_KEY;

    assert(encryptedToken);
    assert(teamId);
    assert(KEY);

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

  if (param.name === 'exa') {
    const key = process.env.EXA_API_KEY;
    assert(key);

    const exaClient = new ExaClient({
      apiKey: key,
    });
    return createAISDKTools(exaClient);
  }

  return null;
};

function isDefined<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

const createTools = (tools: Tool[]) => {
  const aiSdkTools = tools.map(t => toolFactory(t)).filter(isDefined);
  return aiSdkTools.reduce(
    (acc, aiSdkTool) => ({
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...acc,
      ...aiSdkTool,
    }),
    {} as ToolSet,
  );
};

export async function POST(req: Request) {
  const data = (await req.json()) as CreateChatBody;
  const { messages, enabledTools } = data;

  const result = streamText({
    model: openai.responses('gpt-4.1-mini'),
    messages,
    tools: {
      ...(enabledTools ? createTools(enabledTools) : {}),
    },
    // tools: enabledTools ? createTools(enabledTools) : undefined,
    onError: err => {
      console.error('Error occurred in /api/chat', err);
    },
  });

  return result.toDataStreamResponse();
}
