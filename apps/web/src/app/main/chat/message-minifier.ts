import type { UIMessage } from 'ai';
import ky from 'ky';
import { BehaviorSubject } from 'rxjs';
import type { MessageMetadata } from '@/app/api/chat/messageMetadata';
import type { MyMessage } from './Chat';
import {
  generateMessage,
  messagesToThreads,
  type Thread,
  threadsToMessages,
} from './chat-helper';

class MessageMinifier {
  private static instance: MessageMinifier;
  public static LEFT_MESSAGE_COUNT = 3;
  private _isMinifying$ = new BehaviorSubject<boolean>(false);

  private constructor() {}

  public static getInstance(): MessageMinifier {
    if (!MessageMinifier.instance) {
      MessageMinifier.instance = new MessageMinifier();
    }
    return MessageMinifier.instance;
  }

  public get isMinifying() {
    return this._isMinifying$.getValue();
  }

  public get isMinifying$() {
    return this._isMinifying$.asObservable();
  }

  private _cutOffMessages: MyMessage[] = [];

  public get cutOffMessages() {
    return this._cutOffMessages;
  }

  public async minify(messages: MyMessage[]): Promise<MyMessage[]> {
    const leftMessageCount = MessageMinifier.LEFT_MESSAGE_COUNT;

    if (this.isMinifying) {
      return messages;
    }

    try {
      this._isMinifying$.next(true);

      // 1) 최근 N개를 남기고, 그 이전(cutoff)만 요약 대상으로 사용
      const { systemMessages, threads, cutoffThreads } = this.trimMessage(
        messages,
        leftMessageCount,
      );

      const cutoffMessages = threadsToMessages(cutoffThreads) as MyMessage[];
      if (cutoffMessages.length === 0) {
        return messages;
      }

      // 2) 요약은 cutoffMessages를 대상으로 함
      const summary = await this.summarizeMessage(cutoffMessages);
      // 요약 실패/빈 결과면 안전하게 원본 유지
      if (!summary.trim()) {
        return messages;
      }

      // 3) 잘린 메세지 누적 관리
      this._cutOffMessages = [...this._cutOffMessages, ...cutoffMessages];

      return [
        ...systemMessages,
        generateMessage(
          'system',
          `This is the summary of the previous conversation:\n${summary}`,
        ) as UIMessage<MessageMetadata>,
        ...(threadsToMessages(threads) as MyMessage[]),
      ];
    } catch (err) {
      console.error(err);
      return messages;
    } finally {
      this._isMinifying$.next(false);
    }
  }

  /**
   * @param messages : 모든 메세지
   * @param count : 최근 메세지 몇개를 남길 것인지
   */
  private trimMessage(
    messages: MyMessage[],
    count: number,
  ): {
    systemMessages: MyMessage[];
    threads: Thread[];
    cutoffThreads: Thread[];
  } {
    const systemMessages = messages.filter(m => m.role === 'system');

    const userOrAssistantMessages = messages.filter(
      m => m.role === 'user' || m.role === 'assistant',
    );
    const threads = messagesToThreads(userOrAssistantMessages);

    const lastThreads = threads.slice(-count);

    return {
      systemMessages,
      threads: lastThreads,
      cutoffThreads:
        threads.length > count ? threads.slice(0, threads.length - count) : [],
    };
  }

  private async summarizeMessage(messages: MyMessage[]): Promise<string> {
    try {
      const res = await ky.post('/api/chat/summary', {
        json: {
          messages: messages.filter(m => m.role !== 'system'),
        },
      });
      const summary = await res.text();
      return summary;
    } catch (err) {
      console.error(err);
      return '';
    }
  }
}

export const messageMinifier = MessageMinifier.getInstance();
