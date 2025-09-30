import { HttpResponse, http } from 'msw';
import { type SetupServerApi, setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateUIMessage, getTextUIMessage } from '@/core/helper';
import { ChatService } from './ChatService';

// https://github.com/vercel/ai/blob/main/packages/ai/src/ui-message-stream/ui-message-chunks.ts#L14
const successfulResponse = [
  'data: {"type":"start"}\n\n',
  'data: {"type":"start-step"}\n\n',
  'data: {"type":"text-start","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9","providerMetadata":{"openai":{"itemId":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9"}}}\n\n',
  'data: {"type":"text-delta","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9","delta":"Hello"}\n\n',
  'data: {"type":"text-delta","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9","delta":" World"}\n\n',
  'data: {"type":"text-end","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9"}\n\n',
  'data: {"type":"finish-step"}\n\n',
  'data: {"type":"finish","messageMetadata":{"inputTokens":140,"outputTokens":13,"reasoningTokens":0,"cachedInputTokens":0,"totalTokens":153}}\n\n',
  'data: [DONE]\n\n',
];

const failedResponse = [
  'data: {"type":"start"}\n\n',
  'data: {"type":"start-step"}\n\n',
  'data: {"type":"text-start","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9","providerMetadata":{"openai":{"itemId":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9"}}}\n\n',
  'data: {"type":"text-delta","id":"msg_68cf74e1df08819e8b0eb4d9b3cd8e880f0cb33881ee3ee9","delta":"Hello"}\n\n',
  'data: {"type":"error","errorText": "API Connection Error" }\n\n',
  'data: [DONE]\n\n',
];

describe('Summerizer test', () => {
  let server: SetupServerApi;
  beforeEach(() => {
    const restHandler = http.post('/chat', () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          failedResponse.forEach((message, idx) => {
            setTimeout(() => {
              controller.enqueue(encoder.encode(message));
              if (idx === successfulResponse.length - 1) {
                controller.close();
              }
            }, idx * 10);
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
    server = setupServer(restHandler);
    server.listen();
  });
  afterEach(() => {
    server.close();
  });

  it('ChatService Test', async () => {
    const service = new ChatService({
      api: '/chat',
    });

    try {
      await service.sendMessage(generateUIMessage('user', 'Say Hello World.'));
    } catch (err) {
      console.log('==> in err', err);
    }

    service.error$.subscribe(err => {
      console.log('==> in err', err);
    });
    const messageResult = service.data$.getValue()!;
    const text = getTextUIMessage(messageResult);

    expect(text).toBe('Hello World');
    expect(messageResult.metadata).toEqual({
      inputTokens: 140,
      outputTokens: 13,
      reasoningTokens: 0,
      cachedInputTokens: 0,
      totalTokens: 153,
    });
  });
});
