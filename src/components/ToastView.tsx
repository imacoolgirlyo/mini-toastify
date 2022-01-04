import React, { useRef } from 'react';
import { ToastProps } from '../types';

const ToastView: React.FC<ToastProps> = props => {
  const toastRef = useRef<HTMLDivElement>(null)
  const { position, isIn, transition: Transition, deleteToast} = props;

  return (
    <Transition position={position} isIn={isIn} nodeRef={toastRef} done={deleteToast}>
      <div>{props.children}</div>;
    </Transition>
  );
};

export default ToastView;
