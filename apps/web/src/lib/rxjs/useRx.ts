import { useCallback, useEffect, useState } from 'react';
import type { ReadonlyRx, Rx } from './rx';

export const useRxValue = <T>(rx: ReadonlyRx<T>): T => {
  const [value, setValue] = useState(rx.get());

  useEffect(() => {
    const sub = rx.$.subscribe(setValue);
    return () => {
      sub.unsubscribe();
      rx.dispose();
    };
  }, [rx]);

  return value;
};

export const useRx = <T>(rx: Rx<T>): [T, (value: T) => void] => {
  const [value, setValue] = useState(rx.get());

  useEffect(() => {
    const sub = rx.$.subscribe(setValue);
    return () => {
      sub.unsubscribe();
      rx.dispose();
    };
  }, [rx]);

  return [value, rx.set] as const;
};

export const useRxSet = <T>(rx: Rx<T>): ((value: T) => void) => {
  return useCallback(rx.set, [rx]);
};
