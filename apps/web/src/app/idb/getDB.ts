import { type DBSchema, openDB, type IDBPDatabase } from 'idb';
import { z } from 'zod';

export const DB_NAME = 'ALLIN';

export enum TableName {
  CHANNELS = 'channels',
  CHAT_LOGS = 'chat-logs',
}

export const ChannelSchema = z.object({
  id: z.string().uuid().describe('Id of the channel'),
  name: z.string().optional().describe('Channel name'),
  prompt: z.string().optional().describe('AI system prompt'),
  createdAt: z.number().min(0).describe('Timestamp of creation'),
});

export const ChatLogSchema = z.object({
  id: z.string().describe('Id of the message'),
  role: z.enum(['user', 'assistant']).describe('Role of the message'),
  content: z.string().describe('Content of the message'),
  createdAt: z.number().min(0).describe('Timestamp of creation'),
});

interface ALLIN_DB extends DBSchema {
  [TableName.CHANNELS]: {
    key: string;
    value: z.infer<typeof ChannelSchema>;
  };
  [TableName.CHAT_LOGS]: {
    key: string;
    value: z.infer<typeof ChatLogSchema>;
  };
}

let db: IDBPDatabase<ALLIN_DB>;

export const getDB = async () => {
  if (!db) {
    db = await openDB<ALLIN_DB>(DB_NAME, 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        db.createObjectStore(TableName.CHANNELS, {
          keyPath: 'id',
        });
        db.createObjectStore(TableName.CHAT_LOGS, {
          keyPath: 'id',
        });
      },
      blocked(currentVersion, blockedVersion, event) {
        // …
      },
      blocking(currentVersion, blockedVersion, event) {
        // …
      },
      terminated() {
        // …
      },
    });
  }

  return db;
};

export const getTransaction = async () => {
  const db = await getDB();
  return db.transaction([TableName.CHAT_LOGS], 'readwrite');
};

export const getChannel = async (id: string) => {
  const db = await getDB();
  return db.get(TableName.CHANNELS, id);
};

export const addChannel = async (channel: z.infer<typeof ChannelSchema>) => {
  const db = await getDB();
  return db.add(TableName.CHANNELS, channel);
};

export const getChatLogs = async () => {
  const db = await getDB();
  return db.getAll(TableName.CHAT_LOGS);
};

export const addChatLog = async (log: z.infer<typeof ChatLogSchema>) => {
  const db = await getDB();
  return db.add(TableName.CHAT_LOGS, log);
};
