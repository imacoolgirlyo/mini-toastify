import { ToastContainerProps, Id, Toast} from '../types'

export interface ContainerInstance {
  toastKey: number;
  displayedToast: number
  props: ToastContainerProps
  containerId?: Id | null
  isToastActive: (toastId: Id) => boolean
  getToast: (id: Id) => Toast | null
}
