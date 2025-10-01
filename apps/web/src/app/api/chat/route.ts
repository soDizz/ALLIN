import { createAISDKTools } from '@agentic/ai-sdk';
import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  streamText,
  type ToolSet,
  type UIMessage,
} from 'ai';
import type { ToolsServerPayload } from '@/app/tools/ToolManager';
import type { ElementType } from '@/lib/utility-type';
import { clientFactory } from './helper/clientFactory';
import type { MessageMetadata } from './messageMetadata';

export const maxDuration = 30;

type CreateChatBody = {
  messages: UIMessage[];
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

const model =
  process.env.NODE_ENV === 'production' ? 'gpt-4.1' : 'gpt-4.1-mini';

export async function POST(req: Request) {
  const data = (await req.json()) as CreateChatBody;
  const { messages, tools } = data;
  const clientTools = tools ? createTools(tools) : undefined;

  const result = streamText({
    model: openai(model),
    messages: convertToModelMessages(messages),
    // tools: {
    //   ...clientTools,
    // },
    onError: err => {
      console.error('Error occurred in /api/chat', err);
    },
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }): MessageMetadata | undefined => {
      if (part.type === 'finish') {
        return {
          inputTokens: part.totalUsage.inputTokens,
          outputTokens: part.totalUsage.outputTokens,
          reasoningTokens: part.totalUsage.reasoningTokens,
          cachedInputTokens: part.totalUsage.cachedInputTokens,
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
  });
}
