import * as React from 'react';

export type Id = number | string;
export type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';

export type ToastContent = 
| React.ReactNode
// | ((props: ToastContentProps) => React.ReactNode)

interface CommonOptions {

} 

export interface ToastOptions extends CommonOptions {
  type?: TypeOptions
  toastId?: Id
}

export interface ToastProps extends ToastOptions { // ToastProps랑 ToastOptions은 어떤 차이가 있는거지
  closeToast: () => void
  deleteToast: () => void
}

export interface NotValidatedToastProps extends Partial<ToastProps> {
  toastId: Id;
}

