import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { generateUIMessage, getTextUIMessage } from '../helper';
import { createMockStreamServer } from '../test/mockStreamServer';
import { useChat } from './useChat';

describe('useChat', () => {
  it('sendMessage 를 호출하면 API 요청을 보내 메세지를 응답받는다.', async () => {
    const { close } = createMockStreamServer({
      api: '/chat',
      texts: ['Hello', ' World. ', 'I am a AI Agent!'],
    });

    const { result } = renderHook(() =>
      useChat({
        id: 'chatID',
        api: '/chat',
        experimental_throttle: 50,
      }),
    );

    const question = generateUIMessage('user', 'Hi!');
    await result.current.sendMessage(question);

    const uiMessages = result.current.uiMessages.map(uiMessage => ({
      role: uiMessage.role,
      text: getTextUIMessage(uiMessage),
    }));

    expect(uiMessages).toEqual([
      {
        role: 'user',
        text: 'Hi!',
      },
      {
        role: 'assistant',
        text: 'Hello World. I am a AI Agent!',
      },
    ]);

    close();
  });
});
