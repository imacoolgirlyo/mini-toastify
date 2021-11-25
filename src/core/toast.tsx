import { ToastContent, NotValidatedToastProps, ToastOptions, Id } from '../types'
import { isNum, isStr, TYPE} from '../utils'
import { ContainerInstance } from '../hooks'

let containers = new Map<ContainerInstance | Id, ContainerInstance>();

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
    
  }else {

  }
}

const toast = (content: ToastContent, options?: ToastOptions) => { 
  console.log('toast')
  dispatchToast(content, mergeOptions(TYPE.DEFAULT, options))
  //dispatchToast(content)
}


export { toast }