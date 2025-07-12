import { createAISDKTools } from '@agentic/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { type Message, streamText, type ToolSet } from 'ai';
import type { ToolsServerPayload } from '@/app/tools/ToolManager';
import type { ElementType } from '@/lib/utility-type';
import { clientFactory } from './client-factory/clientFactory';

export const maxDuration = 30;

type CreateChatBody = {
  messages: Message[];
  tools: ToolsServerPayload;
};

export type Tool = ElementType<ToolsServerPayload>;

function isDefined<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

const createTools = (tools: ToolsServerPayload) => {
  const aiSdkTools = tools
    .map(t => clientFactory(t))
    .filter(isDefined)
    .map(client => createAISDKTools(client));

  return aiSdkTools.reduce(
    (acc, aiSdkTool) => ({
      ...acc,
      ...aiSdkTool,
    }),
    {} as ToolSet,
  );
};

export async function POST(req: Request) {
  const data = (await req.json()) as CreateChatBody;
  const { messages, tools } = data;

  const clientTools = tools ? createTools(tools) : undefined;

  const result = streamText({
    model: openai.responses('gpt-4.1'),
    messages,
    tools: {
      ...clientTools,
    },
    onError: err => {
      console.error('Error occurred in /api/chat', err);
    },
  });

  return result.toDataStreamResponse();
}
