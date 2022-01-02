import React from 'react';
import { useToastContainer } from '../hooks';
import { Toast, ToastContainerProps } from '../types';
import { POSITION } from '../utils';
import ToastView from './ToastView';
import { Bounce } from './Transition';

/**
 * @param props
 * Toast의 위치, Toast의 커스텀 스타일 값들
 */

export const ToastContainer: React.FC<ToastContainerProps> = props => {
  const { getToastToRender, isToastActive } = useToastContainer(props);
  return (
    <div>
      {getToastToRender((position, toastList) => {
        return (
          <div>
            {toastList.map((toast: Toast) => {
              return (
                <ToastView
                  key={`${position}`}
                  {...toast.props}
                  isIn={isToastActive(toast.props.toastId)}
                >
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

ToastContainer.defaultProps = {
  position: POSITION.BOTTOM_LEFT,
  transition: Bounce,
};
