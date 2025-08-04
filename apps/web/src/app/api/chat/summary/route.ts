import { openai } from '@ai-sdk/openai';
import { generateObject, type Message } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const data = await req.json();
  const { messages } = data;

  const conversation = messages
    .map((m: Message) => `${m.role}: ${m.content}`)
    .join('\n');

  if (conversation.length === 0) {
    return new Response('No conversation', { status: 400 });
  }

  const ret = await generateObject({
    maxTokens: 1000,
    model: openai('gpt-4.1-mini'),
    schema: z.object({
      summary: z.string(),
    }),
    prompt: `
아래 대화를 바탕으로,
유저는 ~~ 에 대해서 물어봤었고, AI 는 어떤 답변을 했다 의 형식으로 모두 요약해줘.
대답은 꼭 영어로 해줘.

The conversation is as follows:
${conversation}
`,
  });

  return new Response(ret.object.summary);
}
