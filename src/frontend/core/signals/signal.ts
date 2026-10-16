/**
 * Pure Angular Signal Implementation (TypeScript)
 * Implements the official Angular 16-19 Signals API (@angular/core).
 * Completely free of any React dependencies.
 *
 * Core Concepts:
 * - WritableSignal<T>: signal(initialValue) -> callable getter () => T, .set(), .update(), .asReadonly()
 * - Signal<T>: computed(() => T) -> auto dependency tracking via reactive context
 * - effect(() => void) -> reacts to signal changes with cleanup support
 * - untracked(() => T) -> reads signal without tracking
 */

type Listener<T> = (value: T) => void;

interface ReactiveNode {
  onDependencyChange: () => void;
}

// Active reactive context stack for automatic dependency graph building
const reactiveContextStack: (ReactiveNode | null)[] = [];

function getCurrentWatcher(): ReactiveNode | null {
  return reactiveContextStack.length > 0 ? reactiveContextStack[reactiveContextStack.length - 1] : null;
}

export interface Signal<T> {
  (): T;
  get(): T;
  subscribe(listener: Listener<T>): () => void;
  destroy?(): void;
}

export interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
  update(updateFn: (prev: T) => T): void;
  asReadonly(): Signal<T>;
}

export interface CreateSignalOptions<T> {
  equal?: (a: T, b: T) => boolean;
}

class WritableSignalImpl<T> implements ReactiveNode {
  private _value: T;
  private _equal: (a: T, b: T) => boolean;
  private _dependencies: Set<ReactiveNode> = new Set();
  private _listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T, options?: CreateSignalOptions<T>) {
    this._value = initialValue;
    this._equal = options?.equal ?? ((a, b) => Object.is(a, b));
  }

  public read(): T {
    const watcher = getCurrentWatcher();
    if (watcher && watcher !== this) {
      this._dependencies.add(watcher);
    }
    return this._value;
  }

  public get(): T {
    return this.read();
  }

  public set(newValue: T): void {
    if (!this._equal(this._value, newValue)) {
      this._value = newValue;
      this.notify();
    }
  }

  public update(updateFn: (prev: T) => T): void {
    this.set(updateFn(this._value));
  }

  public asReadonly(): Signal<T> {
    const fn = (() => this.read()) as Signal<T>;
    fn.get = () => this.read();
    fn.subscribe = (l) => this.subscribe(l);
    return fn;
  }

  public subscribe(listener: Listener<T>): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  public onDependencyChange(): void {
    this.notify();
  }

  private notify(): void {
    // Notify reactive nodes (computed, effects)
    const watchers = Array.from(this._dependencies);
    watchers.forEach((w) => w.onDependencyChange());

    // Notify explicit subscribers
    this._listeners.forEach((l) => l(this._value));
  }
}

/**
 * Creates a WritableSignal in the Angular style:
 * const count = signal(0);
 * count(); // 0
 * count.set(1);
 * count.update(v => v + 1);
 */
export function signal<T>(initialValue: T, options?: CreateSignalOptions<T>): WritableSignal<T> {
  const impl = new WritableSignalImpl<T>(initialValue, options);

  const getter = (() => impl.read()) as WritableSignal<T>;
  getter.get = () => impl.read();
  getter.set = (val: T) => impl.set(val);
  getter.update = (fn: (prev: T) => T) => impl.update(fn);
  getter.asReadonly = () => impl.asReadonly();
  getter.subscribe = (listener: Listener<T>) => impl.subscribe(listener);

  return getter;
}

class ComputedImpl<T> implements ReactiveNode {
  private _computation: () => T;
  private _value!: T;
  private _isDirty: boolean = true;
  private _dependencies: Set<ReactiveNode> = new Set();
  private _listeners: Set<Listener<T>> = new Set();

  constructor(computation: () => T) {
    this._computation = computation;
  }

  public onDependencyChange(): void {
    this._isDirty = true;
    this.recompute();
  }

  private recompute(): void {
    const oldValue = this._value;
    reactiveContextStack.push(this);
    try {
      this._value = this._computation();
      this._isDirty = false;
    } finally {
      reactiveContextStack.pop();
    }

    if (!Object.is(oldValue, this._value)) {
      this._dependencies.forEach((w) => w.onDependencyChange());
      this._listeners.forEach((l) => l(this._value));
    }
  }

  public read(): T {
    const watcher = getCurrentWatcher();
    if (watcher && watcher !== this) {
      this._dependencies.add(watcher);
    }

    if (this._isDirty) {
      this.recompute();
    }

    return this._value;
  }

  public subscribe(listener: Listener<T>): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
}

/**
 * Creates a computed Signal that tracks dependencies automatically:
 * const double = computed(() => count() * 2);
 */
export function computed<T>(computation: () => T): Signal<T> {
  const impl = new ComputedImpl<T>(computation);

  const getter = (() => impl.read()) as Signal<T>;
  getter.get = () => impl.read();
  getter.subscribe = (listener: Listener<T>) => impl.subscribe(listener);

  return getter;
}

export interface EffectRef {
  destroy(): void;
}

/**
 * Creates an effect that runs immediately and whenever any signal read inside changes.
 */
export function effect(effectFn: (onCleanup: (cleanupFn: () => void) => void) => void): EffectRef {
  let cleanup: (() => void) | null = null;
  let isDestroyed = false;

  const node: ReactiveNode = {
    onDependencyChange: () => {
      if (isDestroyed) return;
      run();
    },
  };

  const registerCleanup = (fn: () => void) => {
    cleanup = fn;
  };

  const run = () => {
    if (cleanup) {
      try {
        cleanup();
      } catch (e) {
        console.error('Error during effect cleanup:', e);
      }
      cleanup = null;
    }

    reactiveContextStack.push(node);
    try {
      effectFn(registerCleanup);
    } finally {
      reactiveContextStack.pop();
    }
  };

  run();

  return {
    destroy: () => {
      isDestroyed = true;
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    },
  };
}

/**
 * Executes a function without creating reactive dependencies.
 */
export function untracked<T>(nonReactiveFn: () => T): T {
  reactiveContextStack.push(null);
  try {
    return nonReactiveFn();
  } finally {
    reactiveContextStack.pop();
  }
}
