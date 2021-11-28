import { ContainerInstance } from "../hooks";
import { Id, NotValidatedToastProps, ToastContent, ClearWaitingQueueParams } from "../types"

export const enum Event {
  Show,
  Clear,
  DidMount,
  WillUnmount,
  Change,
  ClearWaitingQueue
}

type OnShowCallback = (
  content: ToastContent,
  options: NotValidatedToastProps
 ) => void

type OnClearCallback = (id?: Id) => void;
type OnClearWaitingQueue = (params: ClearWaitingQueueParams) => void
type onDidMountCallback = (containerInstance: ContainerInstance) => void
type onWillUnmountCallback = onDidMountCallback
export type onChangeCallback = (
  toast: number,
  containerId?: number | string
) => void

type Callback = 
| OnShowCallback
| OnClearCallback
| OnClearWaitingQueue
| onDidMountCallback
| onWillUnmountCallback
| onChangeCallback

type TimeoutId = ReturnType<typeof setTimeout>;

export const eventManager = {
  list: new Map(),
  emitQueue: new Map(),

  on(event: Event, callback: Callback) {
    this.list.has(event) || this.list.set(event, [])
    this.list.get(event)!.push(callback)
    return this
  },
  emit(event: Event, ...args: any[]){
    this.list.has(event) && // 첫 mount 시점에 Event.Show가 list에 있어야한다
      this.list.get(event)!.forEach((callback: Callback) => {
        const timer: TimeoutId = setTimeout(() => { // call stack에 순서대로 들어가게 하기 위해서 timer 사용
           // @ts-ignore
           callback(...args)
        }, 0)

        this.emitQueue.has(event) || this.emitQueue.set(event, []) // event가 emit 되었다는 걸 표시
        this.emitQueue.get(event)!.push(timer)
      })


  }

}