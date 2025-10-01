import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

// https://github.com/vercel/ai/blob/main/packages/ai/src/ui-message-stream/ui-message-chunks.ts#L14
const createStreamResponse = (texts: string[], isFailed?: boolean) => {
  // 특별한 의미 없는 메세지 아이디입니다.
  const messageId = 'm-1234567890';
  return [
    'data: {"type":"start"}\n\n',
    'data: {"type":"start-step"}\n\n',
    `data: {"type":"text-start","id":"${messageId}","providerMetadata":{"openai":{"itemId":"${messageId}"}}}\n\n`,
    ...(isFailed
      ? [`data: {"type":"error","errorText": "API Connection Error" }\n\n`]
      : texts.map(
          text =>
            `data: {"type":"text-delta","id":"${messageId}","delta":"${text}"}\n\n`,
        )),
    `data: {"type":"text-end","id":"${messageId}"}\n\n`,
    'data: {"type":"finish-step"}\n\n',
    'data: {"type":"finish","messageMetadata":{"inputTokens":140,"outputTokens":13,"reasoningTokens":0,"cachedInputTokens":0,"totalTokens":153}}\n\n',
    'data: [DONE]\n\n',
  ];
};

export const createMockStreamServer = ({
  api,
  texts,
  isFailed,
}: {
  api: `/${string}`;
  texts: string[];
  isFailed?: boolean;
}) => {
  const restHandler = http.post(api, () => {
    const encoder = new TextEncoder();
    const streamResponse = createStreamResponse(texts, isFailed);
    const stream = new ReadableStream({
      start(controller) {
        streamResponse.forEach((message, idx) => {
          setTimeout(() => {
            controller.enqueue(encoder.encode(message));
            if (idx === streamResponse.length - 1) {
              controller.close();
            }
          }, idx * 5);
        });
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  });

  const server = setupServer(restHandler);
  server.listen();

  return {
    close: () => {
      server.close();
    },
  };
};
