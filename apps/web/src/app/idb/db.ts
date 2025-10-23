import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { z } from 'zod';
import type { MyMessage } from '../main/chat/Chat';

export const DB_NAME = 'ALLIN';
export const DEFAULT_CHANNEL_ID = 'DEFAULT-CHANNEL';

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string().optional().describe('Channel name'),
  description: z.string().optional().describe('Channel description'),
  prompt: z.string().optional().describe('AI system prompt'),
  createdAt: z.number().min(0).describe('Timestamp of creation'),
});

export type DB_MESSAGE = MyMessage & { channelId: string };

export enum DB_STORE {
  CHANNELS = 'channels',
  MESSAGES = 'messages',
}

interface ALLIN_DB extends DBSchema {
  [DB_STORE.CHANNELS]: {
    key: string;
    value: z.infer<typeof ChannelSchema>;
  };
  [DB_STORE.MESSAGES]: {
    key: string;
    value: DB_MESSAGE;
    indexes: { channelId: string };
  };
}

let db: IDBPDatabase<ALLIN_DB>;

export const getDB = async () => {
  if (!db) {
    db = await openDB<ALLIN_DB>(DB_NAME, 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        if (!db.objectStoreNames.contains(DB_STORE.CHANNELS)) {
          db.createObjectStore(DB_STORE.CHANNELS, {
            keyPath: 'id',
          });
        }
        if (!db.objectStoreNames.contains(DB_STORE.MESSAGES)) {
          const messagesStore = db.createObjectStore(DB_STORE.MESSAGES, {
            autoIncrement: true,
          });
          messagesStore.createIndex('channelId', 'channelId');
        }
      },
    });
  }

  return db;
};

export const getChannel = async (id: string) => {
  const db = await getDB();
  return db.get(DB_STORE.CHANNELS, id);
};

export const getChannels = async () => {
  const db = await getDB();
  return db.getAll(DB_STORE.CHANNELS);
};

export const createChannel = async (channel: z.infer<typeof ChannelSchema>) => {
  const db = await getDB();
  return db.add(DB_STORE.CHANNELS, channel);
};

export const getMessagesByChannelId = async (channelId: string) => {
  const db = await getDB();
  return db.getAllFromIndex(DB_STORE.MESSAGES, 'channelId', channelId);
};

export const addMessage = async (message: DB_MESSAGE) => {
  const db = await getDB();
  const channel = await getChannel(message.channelId);
  if (!channel) {
    throw new Error('Channel not found');
  }

  return db.add(DB_STORE.MESSAGES, message);
};

export const clearStore = async (storeName: DB_STORE) => {
  const db = await getDB();
  return db.clear(storeName);
};
