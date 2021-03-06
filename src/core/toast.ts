import { ContainerInstance } from './../hooks/useToastContainer';
import {
  ToastContent,
  NotValidatedToastProps,
  ToastOptions,
  Id,
} from '../types';
import { eventManager, Event } from './eventManager';
import { isNum, isStr, TYPE } from '../utils';

interface EnqueuedToast {
  content: ToastContent;
  options: NotValidatedToastProps;
}

let containers = new Map<ContainerInstance | Id, ContainerInstance>();
// let containerConfig: ToastContainerProps;
let queue: EnqueuedToast[] = [];
let latestInstance: ContainerInstance | Id;
// let lazy = false;

function isAnyContainerMounted () {
  return containers.size > 0; // parameter를 쓰지 않고 전역변수를 사용함. 이 기준을 뭘까
}

function generateToastId () {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

function getToastId (options?: ToastOptions) {
  if (options && (isNum(options.toastId) || isStr(options.toastId))) {
    return options.toastId;
  }
  return generateToastId();
}

function mergeOptions (type: string, options?: ToastOptions) {
  return {
    ...options,
    type: (options && options.type) || type,
    toastId: getToastId(options),
  } as NotValidatedToastProps;
}

function dispatchToast (
  content: ToastContent,
  options: NotValidatedToastProps
): Id {
  if (isAnyContainerMounted()) {
    eventManager.emit(Event.Show, content, options);
  } else {
    queue.push({ content, options });
    // if(lazy && canUseDom){
    //   /**
    //    * 이건 컴포넌트가 lazy mount 일 때만 사용되는듯!
    //    */

    // }
  }
  return options.toastId;
}

const toast = (content: ToastContent, options?: ToastOptions) => {
  console.log('toast');
  dispatchToast(content, mergeOptions(TYPE.DEFAULT, options));
};

// toast.configure = (config: ToastContainerProps = {}) => {
//   lazy = true
//   containerConfig = config
// }

eventManager
  .on(Event.DidMount, (containerInstance: ContainerInstance) => {
    latestInstance = containerInstance.containerId || containerInstance;
    containers.set(latestInstance, containerInstance);

    queue.forEach(item => {
      eventManager.emit(Event.Show, item.content, item.options);
    });

    queue = [];
  })
  .on(Event.WillUnmount, (containerInstance: ContainerInstance) => {
    containers.delete(containerInstance.containerId || containerInstance);
    if (containers.size === 0) {
      eventManager.off(Event.Show);
      eventManager.off(Event.Clear);
    }
  });

export { toast };
