import React from 'react'
import { ToastProps } from '../types'

const ToastView: React.FC<ToastProps> = ({ children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default ToastView
