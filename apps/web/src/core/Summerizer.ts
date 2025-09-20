import type { Chat } from '@ai-sdk/react';
import {
  type ChatStatus,
  DefaultChatTransport,
  type HttpChatTransportInitOptions,
  type UIMessage,
} from 'ai';
import { assert } from 'es-toolkit';
import { BehaviorSubject } from 'rxjs';
import { generateMessage } from '@/app/main/chat/chat-helper';
import { ChatFactory } from './ChatFactory';

export const DefaultSummerizePrompt = `지금까지 대화 내용을 요약해줘.`;

export class Summerizer<UI_MESSAGE extends UIMessage = UIMessage> {
  private transport: DefaultChatTransport<UI_MESSAGE> | null = null;
  private chat: Chat<UI_MESSAGE> | null = null;
  private prompt: string = DefaultSummerizePrompt;
  public status$ = new BehaviorSubject<ChatStatus>('ready' as ChatStatus);
  public data$ = new BehaviorSubject<UI_MESSAGE | null>(null);

  constructor(options?: Parameters<typeof this.initTransport>[0]) {
    this.initTransport(options);
    this.initChat();
  }

  private initChat() {
    assert(this.transport, 'Err: transport is not initialized.');
    this.chat = ChatFactory.new<UI_MESSAGE>({
      transport: this.transport,
    });
    assert(this.chat, 'Err: chat is not initialized.');

    this.chat['~registerStatusCallback'](() => {
      this.status$.next(this.chat!.status);
    });

    this.chat['~registerMessagesCallback'](() => {
      if (this.chat!.lastMessage) {
        this.data$.next(this.chat!.lastMessage);
      }
    }, 0);
  }

  private initTransport(options?: HttpChatTransportInitOptions<UI_MESSAGE>) {
    this.transport = new DefaultChatTransport(options);
  }

  public doSumerize(messages: UI_MESSAGE[]) {
    assert(this.chat, 'Err: chat is not initialized.');
    this.chat.messages = [...messages, generateMessage('user', this.prompt)];
    this.chat.sendMessage();
  }

  public setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  public getChat() {
    return this.chat;
  }
}
