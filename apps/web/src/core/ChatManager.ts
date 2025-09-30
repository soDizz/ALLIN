import type { UIMessage } from '@ai-sdk/react';
import type { ChatInit } from 'ai';
import { Chat } from './Chat';
import { ChatService } from './ChatService';
import { ChatSummarizer } from './ChatSummarizer';
import { UIMessageStore } from './UiMessageStore';

export class ChatManager {
  private static instance: ChatManager;
  private static chats: Map<string, Chat<UIMessage>> = new Map();

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
  } & ChatInit<UI_MESSAGE>) {
    const summarizer = new ChatSummarizer({
      api: process.env.SUMMARIZER_API_URL ?? '',
    });
    const chatService = new ChatService<UI_MESSAGE>({
      id,
      experimental_throttle,
      ...props,
    });
    const uiMessageStore = new UIMessageStore<UI_MESSAGE>();
    return new Chat<UI_MESSAGE>({
      id,
      chatService,
      summarizer,
      uiMessageStore,
    });
  }

  public static getChatById(id: string) {
    if (ChatManager.chats.has(id)) {
      return ChatManager.chats.get(id);
    }
    return null;
  }
}
