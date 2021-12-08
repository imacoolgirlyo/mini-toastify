import { ToastContent, NotValidatedToastProps, ToastOptions, Id, ToastContainerProps } from '../types'
import { eventManager, Event } from './eventManager'
import { isNum, isStr, TYPE} from '../utils'
import { ContainerInstance } from '../hooks'


interface EnqueuedToast {
  content: ToastContent
  options: NotValidatedToastProps
}

let containers = new Map<ContainerInstance | Id, ContainerInstance>();
let containerConfig: ToastContainerProps;
let queue: EnqueuedToast[] = []
let lazy = false;

function isAnyContainerMounted(){
  return containers.size > 0 // parameter를 쓰지 않고 전역변수를 사용함. 이 기준을 뭘까
}

function generateToastId() {
  return Math.random().toString(36).substr(2, 9)
}


function getToastId(options?: ToastOptions){
  if(options && (isNum(options.toastId) || isStr(options.toastId))){
    return options.toastId
  }
  return generateToastId()
}

function mergeOptions(type: string, options?: ToastOptions){
  return {
    ...options,
    type: (options && options.type) || type,
    toastId: getToastId(options)
  } as NotValidatedToastProps
}

function dispatchToast(content:ToastContent, options: NotValidatedToastProps): Id {
  if(isAnyContainerMounted()){
    // [ ] TO DO
    eventManager.emit(Event.Show, content, options)
  }else {
    queue.push({ content, options }) 
    // if(lazy && canUseDom){ 
    //   /**
    //    * 이건 컴포넌트가 lazy mount 일 때만 사용되는듯!
    //    */ 

    // }
  }
  return options.toastId
}

const toast = (content: ToastContent, options?: ToastOptions) => { 
  console.log('toast')
  dispatchToast(content, mergeOptions(TYPE.DEFAULT, options))
  //dispatchToast(content)
}

toast.configure = (config: ToastContainerProps = {}) => {
  lazy = true
  containerConfig = config
}


export { toast }