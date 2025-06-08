import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const data = await req.json();
  const { messages } = data;

  console.log(data);

  const result = streamText({
    model: openai('gpt-4.1-nano-2025-04-14'),
    messages,
  });

  return result.toDataStreamResponse();
}
