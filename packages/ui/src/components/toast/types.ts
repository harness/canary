import { ReactNode } from 'react'

import { Action, ExternalToast } from 'sonner'

type ToastOptions = Pick<ExternalToast, 'action' | 'duration' | 'dismissible'> & {
  action?: Action
}

export type ToastParamsType = {
  title: string
  description?: ReactNode
  options?: ToastOptions
}

export type LoadingToastParamsType = Omit<ToastParamsType, 'description' | 'options'> & {
  options?: Omit<ToastOptions, 'duration' | 'dismissible'>
}

export type PromiseToastParamsType = Omit<ToastParamsType, 'title' | 'description' | 'options'> & {
  loadingMessage: string
  successMessage?: string
  errorMessage?: string
  options?: Omit<ToastOptions, 'duration'>
}

export type ToastPromiseType<T = any> = Promise<T>
