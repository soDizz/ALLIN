import { describe, expect, it } from 'vitest';
import { ChatSummarizer } from './ChatSummarizer';
import { createMockRestAPIServer } from './test/mockRestAPIServer';

describe('ChatSummerizer', () => {
  it('doSumerize 를 호출하고 결과를 받아올 수 있다.', async () => {
    const { close } = createMockRestAPIServer({
      api: '*/chat/summary',
      text: 'This is a summarized text',
    });

    const summerizer = new ChatSummarizer({
      api: 'http://localhost:4000/chat/summary',
    });
    const result = await summerizer.doSumerize([]);
    expect(result).toBe('This is a summarized text');

    return close;
  });

  it('doSummersize 를 호출하면 status 가 submitted 가 된다.', async () => {
    const { close } = createMockRestAPIServer({
      api: '*/chat/summary',
      text: 'This is a summarized text',
    });

    const summerizer = new ChatSummarizer({
      api: 'http://localhost:4000/chat/summary',
    });

    summerizer.doSumerize([]);
    expect(summerizer.getStatus()).toEqual('submitted');

    return close;
  });
});
