import type { UIMessage } from 'ai';
import type { Brand } from 'ts-brand';
import { v4 as uuidv4 } from 'uuid';
import type { MyMessage } from '../app/main/chat/Chat';

/**
 * [
 *   [
 *     {
 *       role: 'user',
 *       content: 'Hello, how are you?'
 *     },
 *     {
 *       role: 'assistant',
 *       content: 'I am good, thank you!'
 *     }
 *   ],
 *   [
 *     {
 *       role: 'user',
 *       content: 'What is the capital of France?'
 *     },
 *     {
 *       role: 'assistant',
 *       content: 'The capital of France is Paris.'
 *     }
 *   ]
 * ]
 */
export type Thread = Brand<UserOrAssistantMessage[], 'thread'>;

export type UserOrAssistantMessage = MyMessage & {
  role: 'user' | 'assistant';
};

/**
 * 직선으로 나열된 메세지들을 유저의 질문과 AI 의 답변으로 묶어서 배열로 반환한다.
 * 스레드: 유저의 질문과 AI 의 답변으로 묶인 독립적인 배열
 */
export const messagesToThreads = (messages: UIMessage[]): Thread[] => {
  const threads = messages.reduce(
    (acc, message) => {
      if (message.role === 'user') {
        acc.push([message as UserOrAssistantMessage] as Thread);
      }
      if (message.role === 'assistant') {
        const lastGroup = acc[acc.length - 1];
        lastGroup.push(message as UserOrAssistantMessage);
      }

      return acc;
    },
    [] as unknown as Thread[],
  );

  return threads;
};

export const threadsToMessages = (threads: Thread[]): UIMessage[] => {
  return threads.flatMap(t => t);
};

export const generateUIMessage = <
  UI_MESSAGE extends UIMessage,
  Role extends UI_MESSAGE['role'],
>(
  role: Role,
  content: string,
  id: string = uuidv4(),
) => {
  return {
    role,
    id,
    parts: [
      {
        type: 'text',
        text: content,
      },
    ],
  } as UI_MESSAGE & { role: Role };
};

export const getTextUIMessage = (message: UIMessage) => {
  const texts: string[] = [];
  message.parts.forEach(part => {
    if (part.type === 'text') {
      texts.push(part.text);
    }
  });

  return texts.join('\n');
};
