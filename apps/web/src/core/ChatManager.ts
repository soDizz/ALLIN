import type { ChatInit, HttpChatTransportInitOptions, UIMessage } from 'ai';
import { Chat } from './Chat';
import { ChatService } from './ChatService';
import { ChatSummarizer } from './ChatSummarizer';
import { UIMessageStore } from './UiMessageStore';

export class ChatManager {
  private static instance: ChatManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static chats: Map<string, Chat<any>> = new Map();

  private constructor() {}

  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  public static new<UI_MESSAGE extends UIMessage>({
    id,
    experimental_throttle,
    ...props
  }: {
    id: string;
    experimental_throttle: number;
  } & ChatInit<UI_MESSAGE> &
    HttpChatTransportInitOptions<UI_MESSAGE>) {
    const summarizer = new ChatSummarizer({
      api: '/api/chat/summary',
    });
    const chatService = new ChatService<UI_MESSAGE>({
      id,
      experimental_throttle,
      ...props,
    });
    const uiMessageStore = new UIMessageStore<UI_MESSAGE>();
    const newChat = new Chat<UI_MESSAGE>({
      id,
      chatService,
      summarizer,
      uiMessageStore,
    });
    ChatManager.chats.set(id, newChat);
    return newChat;
  }

  public static getChatById<UI_MESSAGE extends UIMessage>(id: string) {
    if (ChatManager.chats.has(id)) {
      return ChatManager.chats.get(id) as Chat<UI_MESSAGE>;
    }
    return null;
  }
}
