import { useEffect, useState } from 'react';
import { type Rx, rx } from './rx';

type Keys = 'on_question_submit' | 'on_question_change';

const channelMap = new Map<string, Rx<number>>();

export const notify = <Key extends Keys>(key: Key) => {
  if (!channelMap.has(key)) {
    createChannel(key);
  }

  const channel = channelMap.get(key);
  if (!channel) {
    throw new Error(`Channel not found for key: ${key}`);
  }

  channel.set(channel.get() + 1);
};

export const useRxNotify = <T extends Keys>(key: T) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const channel = channelMap.get(key) ?? createChannel(key);
    const subscription = channel.$.subscribe(() => setN(prev => prev + 1));

    return () => {
      subscription.unsubscribe();
    };
  }, [key]);

  return n;
};

const createChannel = <T extends Keys>(key: T): Rx<number> => {
  if (channelMap.has(key)) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return channelMap.get(key)!;
  }

  const channel = rx(0);
  channelMap.set(key, channel);
  return channel;
};
