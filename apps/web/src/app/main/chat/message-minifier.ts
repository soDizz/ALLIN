import type { Message } from 'ai';
import ky from 'ky';
import {
  generateMessage,
  messagesToThreads,
  Thread,
  threadsToMessages,
} from './chat-helper';
import { BehaviorSubject } from 'rxjs';

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

  private _cutOffMessages: Message[] = [];

  public get cutOffMessages() {
    return this._cutOffMessages;
  }

  public async minify(messages: Message[]): Promise<Message[]> {
    const leftMessageCount = MessageMinifier.LEFT_MESSAGE_COUNT;

    if (this.isMinifying) {
      return messages;
    }
    try {
      this._isMinifying$.next(true);
      const summary = await this.summarizeMessage(messages);
      const { systemMessages, threads, cutoffThreads } = this.trimMessage(
        messages,
        leftMessageCount,
      );

      this._cutOffMessages = [
        ...this._cutOffMessages,
        ...threadsToMessages(cutoffThreads),
      ];

      return [
        ...systemMessages,
        generateMessage(
          'system',
          `This is the summary of the previous conversation. 
  Just keep in mind that the user was asking about this:
  ${summary}`,
        ),
        ...threadsToMessages(threads),
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
    messages: Message[],
    count: number,
  ): {
    systemMessages: Message[];
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

  private async summarizeMessage(messages: Message[]): Promise<string> {
    try {
      const res = await ky.post('/api/chat/summary', {
        json: {
          messages: messages.filter((m: Message) => m.role !== 'system'),
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
