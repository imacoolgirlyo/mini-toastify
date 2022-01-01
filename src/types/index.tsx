import * as React from 'react';

export type Id = number | string;
export type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';

export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export type ToastContent = React.ReactNode;
// | ((props: ToastContentProps) => React.ReactNode)

export type ToastClassName =
  | ((context?: {
      type?: TypeOptions;
      defaultClassName?: string;
      position: ToastPosition;
      trl?: boolean;
    }) => string)
  | string;

export interface ClearWaitingQueueParams {
  containerId?: Id;
}

interface CommonOptions {
  position?: ToastPosition;
}

export interface ToastOptions<Data = {}> extends CommonOptions {
  type?: TypeOptions;
  toastId?: Id;
  delay?: number;
  updateId?: Id;
  data?: Data;
}

export interface ToastProps extends ToastOptions {
  // ToastProps랑 ToastOptions은 어떤 차이가 있는거지
  toastId: Id;
  staleId?: Id;
  closeToast: () => void;
  deleteToast: () => void;
  children?: ToastContent;
  position: ToastPosition;
}

export interface ToastContainerProps extends CommonOptions {
  className?: ToastClassName;
  newestOnTop?: boolean;
  style?: React.CSSProperties; // inline style 줄 때
  toastStyle?: React.CSSProperties;
  toastClassName?: ToastClassName;
  enableMultiContainer?: boolean;
  limit?: number;
}

/**
 * @INTERNAL
 */
export interface NotValidatedToastProps extends Partial<ToastProps> {
  toastId: Id;
}

/**
 * @INTERNAL
 */

export interface Toast {
  content: ToastContent;
  props: ToastProps;
}
