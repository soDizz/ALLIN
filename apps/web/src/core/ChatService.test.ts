import { assert } from 'es-toolkit';
import { describe, expect, it } from 'vitest';
import { generateUIMessage, getTextUIMessage } from '@/core/helper';
import { ChatService } from './ChatService';
import { createMockStreamServer } from './test/mockStreamServer';

describe('Summerizer test', () => {
  it('sendMessage 를 호출하고 스트림으로 오는 API 응답을 정상적으로 처리할 수 있다.', async () => {
    const { close } = createMockStreamServer({
      api: '/chat',
      texts: ['Hello', ' World'],
    });
    const service = new ChatService({
      api: '/chat',
    });
    const question = generateUIMessage('user', 'Hello');

    await service.sendMessage(question);

    const response = service.data$.getValue();
    assert(response, '');
    const text = getTextUIMessage(response);
    expect(text).toBe('Hello World');

    close();
  });
});
