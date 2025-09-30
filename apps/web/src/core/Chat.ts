import type { UIMessage } from 'ai';
import { v4 } from 'uuid';
import { _uuidv4 } from 'zod/v4/core';
import type { ChatService } from './ChatService';
import type { ChatSummarizer } from './ChatSummarizer';
import type { UIMessageStore } from './UiMessageStore';

// interface IChatManager<UI_MESSAGE extends UIMessage> {
//   sendMessage: (message: UI_MESSAGE) => Promise<void>;
//   uiMessage: UI_MESSAGE[];
//   token
// }

export class Chat<UI_MESSAGE extends UIMessage> {
  private id: string;
  private chatService: ChatService<UI_MESSAGE>;
  private summarizer: ChatSummarizer;
  private uiMessageStore: UIMessageStore<UI_MESSAGE>;

  constructor({
    id = v4(),
    chatService,
    summarizer,
    uiMessageStore,
  }: {
    id: string;
    chatService: ChatService<UI_MESSAGE>;
    summarizer: ChatSummarizer;
    uiMessageStore: UIMessageStore<UI_MESSAGE>;
  }) {
    this.id = id;
    this.chatService = chatService;
    this.summarizer = summarizer;
    this.uiMessageStore = uiMessageStore;

    this.initSubscribe();
  }

  private initSubscribe() {
    this.chatService.data$.subscribe(data => {
      if (data) {
        this.uiMessageStore.setMessages(prev => {
          if (prev.at(-1)?.id === data.id) {
            return [...prev.slice(0, -1), data];
          } else {
            return [...prev, data];
          }
        });
      }
    });
  }

  public async sendMessage(message: UI_MESSAGE & { role: 'user' }) {
    this.uiMessageStore.setMessages(prev => [...prev, message]);
    return this.chatService.sendMessage(message);
  }

  public subscribeMessages(listener: () => void) {
    const { unsubscribe } = this.getMessages$().subscribe(listener);

    return () => unsubscribe();
  }

  public getMessages$() {
    return this.uiMessageStore.getMessages$();
  }

  public getMessages() {
    return this.uiMessageStore.getMessages();
  }

  public summarize(messages: UI_MESSAGE[]) {
    return this.summarizer.doSumerize(messages);
  }

  public getContextMessages() {
    return this.chatService.getMessages();
  }

  public setContextMessages(messages: UI_MESSAGE[]) {
    this.chatService.setMessages(messages);
  }

  public setUiMessages(messages: UI_MESSAGE[]) {
    this.uiMessageStore.setMessages(messages);
  }

  public getStatus() {
    return this.chatService.status$.getValue();
  }

  public subscribeStatus(listener: () => void) {
    const { unsubscribe } = this.getStatus$().subscribe(listener);

    return () => unsubscribe();
  }

  public getStatus$() {
    return this.chatService.status$.asObservable();
  }
}
