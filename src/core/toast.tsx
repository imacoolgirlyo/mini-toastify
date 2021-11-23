import { ToastContent, NotValidatedToastProps, ToastOptions, Id } from '../types'
import { isNum, isStr, TYPE} from '../utils'

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

}

const toast = (content: ToastContent, options?: ToastOptions) => { 
  console.log('toast')
  dispatchToast(content, mergeOptions(TYPE.DEFAULT, options))
  //dispatchToast(content)
}


export { toast }