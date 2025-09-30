import type { ChatStatus } from 'ai';
import { HttpResponse, http } from 'msw';
import { type SetupServerApi, setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ChatSummarizer } from './ChatSummarizer';

describe('ChatSummerizer', () => {
  let server: SetupServerApi;

  beforeAll(() => {
    const restHandler = http.post('*/chat/summary', () => {
      return new HttpResponse('This is a summarized text');
    });

    server = setupServer(restHandler);
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server?.close();
  });

  it('doSumerize 를 호출하고 결과를 받아올 수 있다.', async () => {
    const summerizer = new ChatSummarizer({
      api: 'http://localhost:4000/chat/summary',
    });
    const result = await summerizer.doSumerize([]);
    expect(result).toBe('This is a summarized text');
  });

  it('doSummersize 를 호출하면 status 가 submitted 가 된다.', async () => {
    const summerizer = new ChatSummarizer({
      api: 'http://localhost:4000/chat/summary',
    });

    summerizer.doSumerize([]);
    expect(summerizer.getStatus()).toEqual('submitted');
  });
});
