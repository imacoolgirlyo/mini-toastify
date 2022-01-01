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
} from '../types';
import { isFuc, isStr } from '../utils';
import { ActionType, reducer } from './toastContainerReducer';
import useKeeper from './useKeeper';

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
  const [toast, dispatch] = useReducer(reducer, []);
  const collection = useKeeper<CollectionItem>({});
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
    eventManager
      .cancelEmit(Event.WillUnmount)
      .on(Event.Show, buildToast)
      .on(
        Event.Clear,
        (toastId: Id | undefined) =>
          containerRef.current && removeToast(toastId)
      );

    return () => eventManager.emit(Event.WillUnmount, instance);
  }, []);

  useEffect(() => {
    instance.isToastActive = isToastActive;
    instance.displayedToast = toast.length;
    // eventManager.emit
  }, [toast]);

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
    const { toastId, updateId, data } = options;
    const closeToast = () => removeToast(toastId);
    // const { props} = instance;

    const toastProps: ToastProps = {
      toastId,
      updateId,
      position: options.position || (props.position as ToastPosition),
      closeToast: closeToast,
      deleteToast () {
        // removeFromCollection
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

  return { getToastToRender };
}
