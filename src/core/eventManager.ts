import { ContainerInstance } from '../hooks';
import {
  Id,
  NotValidatedToastProps,
  ToastContent,
  ClearWaitingQueueParams,
} from '../types';

export const enum Event {
  Show,
  Clear,
  DidMount,
  WillUnmount,
  Change,
  ClearWaitingQueue,
}

type OnShowCallback = (
  content: ToastContent,
  options: NotValidatedToastProps
) => void;

type OnClearCallback = (id?: Id) => void;
type OnClearWaitingQueue = (params: ClearWaitingQueueParams) => void;
type onDidMountCallback = (containerInstance: ContainerInstance) => void;
type onWillUnmountCallback = onDidMountCallback;
export type onChangeCallback = (
  toast: number,
  containerId?: number | string
) => void;

type Callback =
  | OnShowCallback
  | OnClearCallback
  | OnClearWaitingQueue
  | onDidMountCallback
  | onWillUnmountCallback
  | onChangeCallback;

type TimeoutId = ReturnType<typeof setTimeout>;

export interface EventManager {
  list: Map<Event, Callback[]>;
  emitQueue: Map<Event, TimeoutId[]>;
  on(event: Event.Show, callback: OnShowCallback): EventManager;
  on(event: Event.Clear, callback: OnClearCallback): EventManager;
  on(event: Event.DidMount, callback: onDidMountCallback): EventManager;
  on(event: Event.WillUnmount, callback: onWillUnmountCallback): EventManager;
  off(event: Event, callback?: Callback): EventManager;
  cancelEmit(event: Event): EventManager;
  emit(
    event: Event.Show,
    content: React.ReactNode,
    options: NotValidatedToastProps
  ): void;
  emit(event: Event.DidMount, containerInstance: ContainerInstance): void;
  emit(event: Event.Clear, id?: string | number): void;
  emit(event: Event.WillUnmount, containerInstance: ContainerInstance): void;
}

export const eventManager: EventManager = {
  list: new Map(),
  emitQueue: new Map(),

  on (event: Event, callback: Callback) {
    this.list.has(event) || this.list.set(event, []);
    this.list.get(event)!.push(callback);
    return this;
  },
  off (event, callback) {
    if (callback) {
      const cb = this.list.get(event)!.filter(cb => cb !== callback);
      this.list.set(event, cb);
      return this;
    }

    this.list.delete(event);
    return this;
  },
  cancelEmit (event) {
    const timers = this.emitQueue.get(event);

    if (timers) {
      timers.forEach(clearTimeout);
      this.emitQueue.delete(event);
    }

    return this;
  },
  emit (event: Event, ...args: any[]) {
    this.list.has(event) && // 첫 mount 시점에 Event.Show가 list에 있어야한다
      this.list.get(event)!.forEach((callback: Callback) => {
        const timer: TimeoutId = setTimeout(() => {
          // call stack에 순서대로 들어가게 하기 위해서 timer 사용
          // @ts-ignore
          callback(...args);
        }, 0);

        this.emitQueue.has(event) || this.emitQueue.set(event, []); // event가 emit 되었다는 걸 표시
        this.emitQueue.get(event)!.push(timer);
      });
  },
};
