import type { ChatStatus, UIMessage } from 'ai';
import ky from 'ky';
import { BehaviorSubject } from 'rxjs';
import { getTextUIMessage } from './helper';

export const DefaultSummerizePrompt = `지금까지 대화 내용을 요약해줘.`;

type ChatSummarizerOptions = {
  api: string;
  prompt?: string;
};

export class ChatSummarizer {
  private api: string;
  private prompt: string;
  public status$ = new BehaviorSubject<ChatStatus>('ready');

  constructor(options: ChatSummarizerOptions) {
    this.api = options.api;
    this.prompt ??= options.prompt ?? DefaultSummerizePrompt;
  }

  public async doSumerize(messages: UIMessage[]): Promise<string> {
    this.status$.next('submitted');
    let error: Error | null = null;

    const conversationText = messages
      .map(message => {
        return `${message.role}: ${getTextUIMessage(message)}`;
      })
      .join('\n')
      .concat('\n', this.prompt);

    try {
      const res = await ky.post(this.api, {
        json: {
          text: conversationText,
        },
      });
      const summary = await res.text();
      return summary;
    } catch (err) {
      error = err as Error;
      throw err;
    } finally {
      if (error) {
        this.status$.next('error');
      } else {
        this.status$.next('ready');
      }
    }
  }

  public setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  public getStatus() {
    return this.status$.getValue();
  }
}
