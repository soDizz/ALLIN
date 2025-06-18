import { BehaviorSubject } from 'rxjs';

export type ReadonlyRx<T> = {
  get: () => T;
  dispose: () => void;
  $: BehaviorSubject<T>;
};

export type Rx<T> = ReadonlyRx<T> & {
  set: (value: RxSetterParam<T>) => void;
};

export function rx<T>(input: T): Rx<T>;
export function rx<T>(input: T) {
  const subject = new BehaviorSubject<T>(input);

  return {
    get: () => subject.value,
    set: (setter: RxSetterParam<T>) => {
      subject.next(
        typeof setter === 'function' ? (setter as (prev: T) => T)(subject.value) : setter,
      );
    },
    $: subject,
    dispose: () => {
      subject.complete();
      subject.unsubscribe();
    },
  };
}

export type RxSetterParam<T> = T | ((prev: T) => T);
