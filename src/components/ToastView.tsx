import React from 'react';
import { ToastProps } from '../types';

const ToastView: React.FC<ToastProps> = props => {
  const { position } = props;

  return (
    <Transition position={position}>
      <div>{props.children}</div>;
    </Transition>
  );
};

export default ToastView;
