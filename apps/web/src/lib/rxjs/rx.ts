import { type BehaviorSubject, isObservable, Subject, type Observable } from 'rxjs';

export type ReadonlyRx<T> = {
  get: () => T;
  dispose: () => void;
  $: BehaviorSubject<T>;
};

export type Rx<T> = ReadonlyRx<T> & {
  set: (value: RxSetterParam<T>) => void;
};

export function rx<T>(input: Observable<T>, initialValue: T): ReadonlyRx<T>;
export function rx<T>(input: T): Rx<T>;
export function rx<T>(input: T | Observable<T>, initialValue?: T) {
  if (isObservable(input)) {
    let prevValue = initialValue;

    const sub = input.subscribe(value => {
      prevValue = value;
    });

    return {
      get: () => prevValue,
      $: input,
      dispose: () => {
        sub.unsubscribe();
      },
    };
  }

  const subject = new Subject<T>();
  let prevValue = input;

  subject.subscribe(value => {
    prevValue = value;
  });

  return {
    get: () => prevValue,
    set: (setter: RxSetterParam<T>) => {
      subject.next(typeof setter === 'function' ? (setter as (prev: T) => T)(prevValue) : setter);
    },
    $: subject,
    dispose: () => {
      subject.complete();
      subject.unsubscribe();
    },
  };
}

export type RxSetterParam<T> = T | ((prev: T) => T);
