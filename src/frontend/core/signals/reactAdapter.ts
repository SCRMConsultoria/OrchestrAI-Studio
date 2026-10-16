import { useSyncExternalStore } from 'react';
import { Signal, WritableSignal } from './signal';

/**
 * Adapter hook to consume an Angular Signal within a React view layer.
 * Uses React 19's useSyncExternalStore for tear-free synchronization with Angular Signals.
 */
export function useSignal<T>(sig: Signal<T>): [T, (val: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (callback) => sig.subscribe(callback),
    () => sig.get(),
    () => sig.get()
  );

  const setVal = (val: T | ((prev: T) => T)) => {
    const writable = sig as unknown as WritableSignal<T>;
    if (typeof writable.set === 'function') {
      if (typeof val === 'function') {
        writable.update(val as (prev: T) => T);
      } else {
        writable.set(val);
      }
    }
  };

  return [value, setVal];
}

/**
 * Read-only value subscription hook for computed signals.
 */
export function useSignalValue<T>(sig: Signal<T>): T {
  return useSyncExternalStore(
    (callback) => sig.subscribe(callback),
    () => sig.get(),
    () => sig.get()
  );
}
