'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Observable, Subscription } from 'rxjs';
import type { ReadonlyRx, Rx, RxSetterParam } from './rx';

// 기존 형식: ReadonlyRx<T>를 받는 경우
export function useRxValue<T>(rx: ReadonlyRx<T>): T;
// 새로운 형식: Observable<T>와 defaultValue를 받는 경우
export function useRxValue<T>(observable: Observable<T>, defaultValue: T): T;
// 실제 구현
export function useRxValue<T>(
  rxOrObservable: ReadonlyRx<T> | Observable<T>,
  defaultValue?: T,
): T {
  // ReadonlyRx 타입인지 확인 (get 메서드가 있는지 확인)
  const isReadonlyRx = useCallback(
    (obj: ReadonlyRx<T> | Observable<T>): obj is ReadonlyRx<T> => {
      return 'get' in obj && typeof obj.get === 'function' && '$' in obj;
    },
    [],
  );

  const [value, setValue] = useState<T>(() => {
    if (isReadonlyRx(rxOrObservable)) {
      return rxOrObservable.get();
    } else {
      // Observable인 경우 defaultValue 사용
      return defaultValue as T;
    }
  });

  useEffect(() => {
    let sub: Subscription;

    if (isReadonlyRx(rxOrObservable)) {
      // ReadonlyRx인 경우
      sub = rxOrObservable.$.subscribe(setValue);
    } else {
      // Observable인 경우
      sub = rxOrObservable.subscribe(setValue);
    }

    return () => {
      sub.unsubscribe();
    };
  }, [rxOrObservable, isReadonlyRx]);

  return value;
}

export const useRx = <T>(rx: Rx<T>): [T, (value: RxSetterParam<T>) => void] => {
  const [value, setValue] = useState(rx.get());

  useEffect(() => {
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
