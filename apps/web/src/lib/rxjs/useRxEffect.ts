import { useEffect } from 'react';
import type { Observable } from 'rxjs';
import { useEventCallback } from 'usehooks-ts';

export const useRxEffect = <T>(
  observable: Observable<T>,
  on: (value: T) => void,
) => {
  const onEvent = useEventCallback(on);

  useEffect(() => {
    const subscription = observable.subscribe(onEvent);
    return () => {
      subscription.unsubscribe();
    };
  }, [observable, onEvent]);
};
