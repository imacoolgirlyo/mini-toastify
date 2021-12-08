import React from 'react'
import { useToastContainer } from '../hooks'
import { ToastContainerProps } from '../types'

export const ToastContainer: React.FC<ToastContainerProps> = props => {
  useToastContainer(props)
  return (
    <div>
      hi
    </div>
  )
}

