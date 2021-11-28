import React from 'react'
import { useToastContainer } from '../hooks'
import { ToastContainerProps } from '../types'

const ToastContainer: React.FC<ToastContainerProps> = props => {
  useToastContainer(props)
  return (
    <div>
      
    </div>
  )
}

export default ToastContainer
