import React from 'react';
import { useToastContainer } from '../hooks';
import { Toast, ToastContainerProps } from '../types';
import ToastView from './ToastView';

/**
 * @param props
 * Toast의 위치, Toast의 커스텀 스타일 값들
 */

export const ToastContainer: React.FC<ToastContainerProps> = props => {
  const { getToastToRender } = useToastContainer(props);
  return (
    <div>
      {getToastToRender((position, toastList) => {
        return (
          <div>
            {toastList.map((toast: Toast) => {
              return (
                <ToastView key={`${position}`} {...toast.props}>
                  {toast.content}
                </ToastView>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
