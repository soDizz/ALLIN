import { useSetAtom } from 'jotai';
import { useLayoutEffect } from 'react';
import { DB, DEFAULT_CHANNEL_ID } from '@/app/idb/db';
import { isDataBaseInitializedAtom } from '@/app/idb/idbStore';

export const DataBaseInitializer = () => {
  const setDbInitialized = useSetAtom(isDataBaseInitializedAtom);
  useLayoutEffect(() => {
    const initializeDb = async () => {
      try {
        const defaultChannel = await DB.getChannel(DEFAULT_CHANNEL_ID);
        if (!defaultChannel) {
          await DB.createChannel({
            id: DEFAULT_CHANNEL_ID,
            name: 'Default Channel',
            createdAt: Date.now(),
          });
        }
      } catch (e) {
        console.error('Failed to initialize db', e);
      } finally {
        setDbInitialized(true);
      }
    };
    initializeDb();
  }, [setDbInitialized]);

  return null;
};
