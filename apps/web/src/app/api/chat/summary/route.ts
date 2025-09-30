import { openai } from '@ai-sdk/openai';
import { generateObject, type UIMessage } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const data = await req.json();
  const { text } = data;

  if (text.length === 0) {
    return new Response('No conversation', { status: 400 });
  }

  const ret = await generateObject({
    model: openai('gpt-4.1-mini'),
    schema: z.object({
      summary: z.string(),
    }),
    prompt: text,
  });

  return new Response(ret.object.summary);
}
