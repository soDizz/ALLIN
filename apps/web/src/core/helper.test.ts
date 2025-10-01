import type { UIMessage } from 'ai';
import { describe, expect, it } from 'vitest';
import { generateUIMessage, getTextUIMessage } from './helper';

describe('채팅 헬퍼 함수', () => {
  describe('getUIMessageText', () => {
    it('단일 텍스트 파트에서 텍스트를 추출해야 한다', () => {
      const message: UIMessage = {
        id: 'test-1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: '안녕하세요',
          },
        ],
      };

      const result = getTextUIMessage(message);
      expect(result).toBe('안녕하세요');
    });

    it('여러 텍스트 파트에서 텍스트를 추출하고 연결해야 한다', () => {
      const message: UIMessage = {
        id: 'test-2',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: '첫 번째 부분',
          },
          {
            type: 'text',
            text: '두 번째 부분',
          },
          {
            type: 'text',
            text: '세 번째 부분',
          },
        ],
      };

      const result = getTextUIMessage(message);
      expect(result).toBe('첫 번째 부분\n두 번째 부분\n세 번째 부분');
    });

    it('텍스트 파트가 없는 메시지는 빈 문자열을 반환해야 한다', () => {
      const message: UIMessage = {
        id: 'test-4',
        role: 'assistant',
        parts: [
          {
            type: 'tool-call',
            state: 'input-streaming',
            input: {},
            toolCallId: 'call-1',
          },
        ],
      };

      const result = getTextUIMessage(message);
      expect(result).toBe('');
    });

    it('빈 파트 배열을 처리해야 한다', () => {
      const message: UIMessage = {
        id: 'test-5',
        role: 'user',
        parts: [],
      };

      const result = getTextUIMessage(message);
      expect(result).toBe('');
    });

    it('빈 텍스트 내용을 처리해야 한다', () => {
      const message: UIMessage = {
        id: 'test-6',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: '',
          },
        ],
      };

      const result = getTextUIMessage(message);
      expect(result).toBe('');
    });

    it('generateUIMessage 헬퍼와 함께 동작해야 한다', () => {
      const message = generateUIMessage('user', '생성된 메시지 내용');

      const result = getTextUIMessage(message);
      expect(result).toBe('생성된 메시지 내용');
    });
  });
});
