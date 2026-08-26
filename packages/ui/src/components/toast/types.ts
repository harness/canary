import { ReactNode } from 'react'

import { Action, ExternalToast } from 'sonner'

type ToastOptions = Pick<ExternalToast, 'action' | 'duration' | 'dismissible'> & {
  onClose?: () => void
  onAutoClose?: () => void
  action?: Action
}

export type InfoToastSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type InfoToastCtaPosition = 'top' | 'bottom'

export type InfoToastOptions = ToastOptions & {
  secondaryAction?: Action
  ctaPosition?: InfoToastCtaPosition
  severity?: InfoToastSeverity
}

export type ToastParamsType = {
  title: string
  description?: ReactNode
  options?: ToastOptions
}

export type InfoToastParamsType = {
  title: string
  description?: ReactNode
  options?: InfoToastOptions
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
