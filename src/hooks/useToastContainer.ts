import { cloneElement, isValidElement, useEffect, useReducer } from 'react'
import { eventManager, Event } from '../core/eventManager'
import { ToastContainerProps, Id, Toast, ToastContent, NotValidatedToastProps, ToastProps} from '../types'
import { isFuc, isStr } from '../utils'
import { ActionType, reducer } from './toastContainerReducer'

export interface ContainerInstance {
  toastKey: number;
  displayedToast: number
  props: ToastContainerProps
  containerId?: Id | null
  isToastActive: (toastId: Id) => boolean
  getToast: (id: Id) => Toast | null
}

export function useToastContainer(props: ToastContainerProps) {
  const [toast, dispatch] = useReducer(reducer, [])


  useEffect(() => {
    eventManager
    .on(Event.Show, buildToast)
  }, [])

  function removeToast(toastId?: Id){
    dispatch({ type: ActionType.REMOVE, toastId})
  }

  function buildToast(
    content: ToastContent,
    { delay, staleId, ...options } : NotValidatedToastProps
  ){
    
    const { toastId, updateId, data} = options;
    const closeToast = () => removeToast(toastId)
    // const { props} = instance;

    const toastProps: ToastProps = {
      toastId,
      updateId,
      closeToast: closeToast,
      deleteToast(){
        // removeFromCollection
      }
    }


    let toastContent = content;

    if(isValidElement(content) && isStr(content.type)){
      toastContent = cloneElement(content, {
        closeToast,
        toastProps,
        data
      })
    } else if (isFuc(content)){
      toastContent = content({ closeToast, toastProps, data});
    }

    appendToast(toastContent, toastProps, staleId)
  }

  function appendToast(content: ToastContent,
    toastProps: ToastProps,
    staleId?: Id){
    const { toastId } = toastProps;
    // if(staleId) delete collection[staleId]

    dispatch({
      type: ActionType.ADD,
      toastId,
      staleId
    })
  }

}