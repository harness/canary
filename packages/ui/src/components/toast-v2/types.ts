import { Action, ExternalToast } from 'sonner'

type ToastOptions = Omit<ExternalToast, 'action'> & {
  action?: Action
}

export type ToastParamsType = {
  title: string
  description: string
  options?: ToastOptions
}

export type LoadingToastParamsType = Omit<ToastParamsType, 'description' | 'options'> & {
  options?: Omit<ToastOptions, 'duration' | 'action' | 'dismissible'>
}

export type PromiseToastParamsType = Omit<ToastParamsType, 'options'> & {
  options?: Omit<ToastOptions, 'duration'>
}

export type ToastPromiseType<T = any> = Promise<T>
