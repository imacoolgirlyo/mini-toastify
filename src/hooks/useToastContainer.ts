import { cloneElement, isValidElement, ReactElement, useEffect, useReducer } from 'react'
import { eventManager, Event } from '../core/eventManager'
import { ToastContainerProps, Id, Toast, ToastContent, NotValidatedToastProps, ToastProps, ToastPosition} from '../types'
import { isFuc, isStr } from '../utils'
import { ActionType, reducer } from './toastContainerReducer'
import useKeeper from './useKeeper'

export interface ContainerInstance {
  toastKey: number;
  displayedToast: number
  props: ToastContainerProps
  containerId?: Id | null
  isToastActive: (toastId: Id) => boolean
  getToast: (id: Id) => Toast | null
}

type CollectionItem = Record<Id, Toast>

export function useToastContainer(props: ToastContainerProps) {
  const [toast, dispatch] = useReducer(reducer, [])
  const collection = useKeeper<CollectionItem>({})


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

     if(staleId) delete collection[staleId]

     collection[toastId] = {
       content,
       props: toastProps
     }

    dispatch({
      type: ActionType.ADD,
      toastId,
      staleId
    })
  }

  function getToastToRender<T>(
    callbackFunc: (position: ToastPosition, toastList: Toast[]) => T){
    
    const toastList = Object.keys(collection)

  }

  return { getToastToRender}

}