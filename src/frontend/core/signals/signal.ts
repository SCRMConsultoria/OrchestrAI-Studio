import { useState, useEffect, useRef } from 'react';

/**
 * Angular-style Signal implementation in TypeScript
 * Provides signal(), computed(), and useSignal() hook for fine-grained reactivity.
 */

type Listener<T> = (value: T) => void;

export class Signal<T> {
  private _value: T;
  private _listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  // Angular signal callable getter syntax: sig()
  public value(): T {
    return this._value;
  }

  public get(): T {
    return this._value;
  }

  public set(newValue: T): void {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  public update(updateFn: (prev: T) => T): void {
    this.set(updateFn(this._value));
  }

  public subscribe(listener: Listener<T>): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private notify(): void {
    this._listeners.forEach((listener) => listener(this._value));
  }
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal<T>(initialValue);
}

export function computed<T>(computeFn: () => T, dependencies: Signal<any>[]): Signal<T> {
  const compSignal = new Signal<T>(computeFn());

  dependencies.forEach((dep) => {
    dep.subscribe(() => {
      compSignal.set(computeFn());
    });
  });

  return compSignal;
}

/**
 * Hook to read and subscribe to a Signal with fine-grained re-rendering.
 */
export function useSignal<T>(sig: Signal<T>): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(sig.get());
  const sigRef = useRef(sig);
  sigRef.current = sig;

  useEffect(() => {
    const unsubscribe = sigRef.current.subscribe((val) => {
      setState(val);
    });
    return unsubscribe;
  }, []);

  const setVal = (val: T | ((prev: T) => T)) => {
    if (typeof val === 'function') {
      sig.update(val as (prev: T) => T);
    } else {
      sig.set(val);
    }
  };

  return [state, setVal];
}
