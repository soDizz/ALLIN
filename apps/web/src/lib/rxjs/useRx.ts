'use client';

import type { ReadonlyRx, Rx, RxSetterParam } from './rx';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export const useRxValue = <T>(rx: ReadonlyRx<T>): T => {
  const [value, setValue] = useState(rx.get());

  useLayoutEffect(() => {
    const sub = rx.$.subscribe(setValue);
    return () => {
      sub.unsubscribe();
    };
  }, [rx]);

  return value;
};

export const useRx = <T>(rx: Rx<T>): [T, (value: RxSetterParam<T>) => void] => {
  const [value, setValue] = useState(rx.get());

  useLayoutEffect(() => {
    const sub = rx.$.subscribe(setValue);
    return () => {
      sub.unsubscribe();
    };
  }, [rx]);

  return [value, rx.set] as const;
};

export const useRxSet = <T>(rx: Rx<T>): ((value: RxSetterParam<T>) => void) => {
  return useCallback(rx.set, [rx]);
};
