import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ToastTransitionProps } from '../types';
// import { Default } from './constants';

export interface CSSTransitionProps {
  enter: string;
  exit: string;
  appendPosition?: boolean;
  // collapse?: boolean;
  // collapseDuration?: number;
}

const enum AnimationStep {
  Enter,
  Exit,
}

export function cssTransition ({
  enter,
  exit,
  appendPosition = false,
  // collapse = true,
  // collapseDuration = Default.COLLAPSE_DURATION,
}: CSSTransitionProps) {
  return function ToastTransition ({
    children,
    position,
    // preventExitTransition,
    nodeRef, // toastRef
    isIn,
    done,
  }: ToastTransitionProps) {
    const enterClassName = appendPosition ? `${enter}--${position}` : position;
    const exitClassName = appendPosition ? `${exit}--${position}` : position;
    const baseClassName = useRef<string>();
    const animationStep = useRef(AnimationStep.Enter);

    useLayoutEffect(() => {
      onEnter();
    }, []);

    useEffect(() => {
      // if (!isIn) preventExitTransition ? onExited() : onExit();
      if(!isIn) onExit()
    }, [isIn]);

    function onEnter () {
      const node = nodeRef.current!;
      baseClassName.current = node.className;
      node.className += `${enterClassName}`;
      node.addEventListener('animationend', onEntered);
    }

    function onEntered (e: AnimationEvent) {
      if (e.target !== nodeRef.current) return;

      const node = nodeRef.current!;
      node.removeEventListener('animationend', onEntered);
      if (animationStep.current === AnimationStep.Enter) {
        node.className = baseClassName.current!;
      }
    }

    function onExit () {
      animationStep.current = AnimationStep.Exit;
      const node = nodeRef.current!;

      node.className += `${exitClassName}`;
      node.addEventListener('animationend', onExited);
    }

    function onExited () {
      const node = nodeRef.current!;
      node.removeEventListener('animationend', onExited);

      done();
    }
    return <>{children}</>;
  };
}
