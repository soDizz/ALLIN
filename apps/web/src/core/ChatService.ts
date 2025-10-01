import { Chat } from '@ai-sdk/react';
import {
  type ChatInit,
  type ChatStatus,
  DefaultChatTransport,
  type HttpChatTransportInitOptions,
  type UIMessage,
} from 'ai';
import { assert } from 'es-toolkit';
import { BehaviorSubject } from 'rxjs';

export class ChatService<UI_MESSAGE extends UIMessage = UIMessage> {
  private transport: DefaultChatTransport<UI_MESSAGE> | null = null;
  private chat: Chat<UI_MESSAGE> | null = null;
  public status$ = new BehaviorSubject<ChatStatus>('ready' as ChatStatus);
  public data$ = new BehaviorSubject<UI_MESSAGE | null>(null);
  public error$ = new BehaviorSubject<Error | undefined>(undefined);

  constructor(
    options?: Parameters<typeof this.initTransport>[0] &
      ChatInit<UI_MESSAGE> & {
        experimental_throttle?: number;
      },
  ) {
    this.transport = this.initTransport(options);
    this.chat = this.initChat(this.transport, options);
  }

  private initChat(
    transport: DefaultChatTransport<UI_MESSAGE>,
    options?: ChatInit<UI_MESSAGE> & {
      experimental_throttle?: number;
    },
  ) {
    const chat = new Chat({ transport, ...options });
    assert(chat, 'Err: chat is not initialized.');

    chat['~registerStatusCallback'](() => {
      this.status$.next(chat.status);
    });

    chat['~registerMessagesCallback'](() => {
      if (chat.lastMessage) {
        this.data$.next(chat.lastMessage);
      }
    }, options?.experimental_throttle ?? 0);

    chat['~registerErrorCallback'](() => {
      this.error$.next(chat.error);
    });

    return chat;
  }

  private initTransport(options?: HttpChatTransportInitOptions<UI_MESSAGE>) {
    return new DefaultChatTransport(options);
  }

  public getChat(): Chat<UI_MESSAGE> {
    assert(this.chat, 'Err: chat is not initialized.');
    return this.chat;
  }

  public getMessages(): UI_MESSAGE[] {
    assert(this.chat, 'Err: chat is not initialized.');
    return this.chat.messages;
  }

  public setMessages(messages: UI_MESSAGE[]): void {
    assert(this.chat, 'Err: chat is not initialized.');
    this.chat.messages = messages;
  }

  public async sendMessage(message: UI_MESSAGE & { role: 'user' }) {
    assert(this.chat, 'Err: chat is not initialized.');

    if (['streaming', 'submitted'].includes(this.chat.status)) {
      throw new Error('Err: chat is streaming or submitted.');
    }

    this.chat.messages.push(message);
    this.chat.sendMessage();

    return new Promise<void>((resolve, reject) => {
      const unsub = this.status$.subscribe(status => {
        if (status === 'ready') {
          resolve();
          unsub.unsubscribe();
        } else if (status === 'error') {
          reject(new Error('Err: chat is error during sending message.'));
          unsub.unsubscribe();
        }
      });
    });
  }

  public async stop() {
    assert(this.chat, 'Err: chat is not initialized.');
    this.chat.stop();
  }
}
