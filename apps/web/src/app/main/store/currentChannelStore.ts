import { atom } from 'jotai';
import { DEFAULT_CHANNEL_ID } from '@/app/idb/db';

export const currentChannelIdAtom = atom(DEFAULT_CHANNEL_ID);
