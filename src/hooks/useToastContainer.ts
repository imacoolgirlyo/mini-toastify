import {
  cloneElement,
  isValidElement,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { eventManager, Event } from '../core/eventManager';
import {
  ToastContainerProps,
  Id,
  Toast,
  ToastContent,
  NotValidatedToastProps,
  ToastProps,
  ToastPosition,
  ToastTransition,
} from '../types';
import { isFuc, isStr, isToastValid } from '../utils';
import { ActionType, reducer } from './toastContainerReducer';
import useKeeper from './useKeeper';

interface QueuedToast {
  toastContent: ToastContent
  toastProps: ToastProps
  staleId?: Id
}
export interface ContainerInstance {
  toastKey: number;
  displayedToast: number;
  props: ToastContainerProps;
  containerId?: Id | null;
  isToastActive: (toastId: Id) => boolean;
  getToast: (id: Id) => Toast | null;
}

type CollectionItem = Record<Id, Toast>;
type ToastToRender = Partial<Record<ToastPosition, Toast[]>>;

export function useToastContainer (props: ToastContainerProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [toast, dispatch] = useReducer(reducer, []);
  const collection = useKeeper<CollectionItem>({});
  let toastCount = useKeeper(0)
  let queue = useKeeper<QueuedToast[]>([]); // Queue에는 대기타고 있는 toast들 (limit이 걸려있는데 limit보다 많은 요청이 들어온 경우)
  const containerRef = useRef(null);
  const instance = useKeeper<ContainerInstance>({
    toastKey: 1,
    displayedToast: 0,
    props,
    containerId: null,
    isToastActive: isToastActive,
    getToast: id => collection[id] || null,
  });

  useEffect(() => {
    instance.containerId = props.containerId;
    eventManager
      .cancelEmit(Event.WillUnmount)
      .on(Event.Show, buildToast)
      .on(
        Event.Clear,
        (toastId: Id | undefined) =>
          containerRef.current && removeToast(toastId)
      )
      .emit(Event.DidMount, instance);

    return () => {
      return eventManager.emit(Event.WillUnmount, instance);
    };
  }, []);

  useEffect(() => {
    instance.isToastActive = isToastActive;
    instance.displayedToast = toast.length;
    // eventManager.emit
  }, [toast]);

  useEffect(() => {
    instance.props = props;
  });

  function isToastActive (id: Id) {
    return toast.indexOf(id) !== -1;
  }

  function removeToast (toastId?: Id) {
    dispatch({ type: ActionType.REMOVE, toastId });
  }

  function buildToast (
    content: ToastContent,
    { delay, staleId, ...options }: NotValidatedToastProps
  ) {
    console.log('toast triggered', content);
    const { toastId, updateId, data } = options;
    const closeToast = () => removeToast(toastId);
    // const { props} = instance;
    const isNotAnUpdate = options.updateId === null

    if(isNotAnUpdate) toastCount++

    const toastProps: ToastProps = {
      toastId,
      updateId,
      position: options.position || (props.position as ToastPosition),
      isIn: false,
      transition: options.transition || (props.transition as ToastTransition),
      closeToast: closeToast,
      deleteToast () {
        removeFromCollection(toastId)
      },
    };

    let toastContent = content;

    if (isValidElement(content) && isStr(content.type)) {
      toastContent = cloneElement(content, {
        closeToast,
        toastProps,
        data,
      });
    } else if (isFuc(content)) {
      toastContent = content({ closeToast, toastProps, data });
    }

    appendToast(toastContent, toastProps, staleId);
  }

  function removeFromCollection(toastId: Id){
    delete collection[toastId]
    const queueLen = queue.length
    toastCount = isToastValid(toastId)
    ? toastCount - 1
    : toastCount - instance.displayedToast
    
    if(toastCount < 0) toastCount = 0 

    if(queueLen > 0){
      // queue에 들어간 애들 처리하는 로직
    }else {
      forceUpdate()
    }}

  function appendToast (
    content: ToastContent,
    toastProps: ToastProps,
    staleId?: Id
  ) {
    const { toastId } = toastProps;

    if (staleId) delete collection[staleId];

    collection[toastId] = {
      content,
      props: toastProps,
    };

    dispatch({
      type: ActionType.ADD,
      toastId,
      staleId,
    });
  }

  function getToastToRender<T> (
    callbackFunc: (position: ToastPosition, toastList: Toast[]) => T
  ) {
    const toastList = Object.keys(collection);

    const groupByPosition: ToastToRender = {};

    toastList.forEach(toastId => {
      const toastItem = collection[toastId];
      const { position } = toastItem.props;

      groupByPosition[position] || (groupByPosition[position] = []);
      groupByPosition[position]!.push(toastItem);
    });

    return (Object.keys(groupByPosition) as Array<ToastPosition>).map(
      position => callbackFunc(position, groupByPosition[position]!)
    );
  }

  return { getToastToRender, isToastActive };
}
