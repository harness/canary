import { toast as sonnerToast } from 'sonner'

import { CustomToast } from './custom-toast'
import {
  InfoToastParamsType,
  LoadingToastParamsType,
  PromiseToastParamsType,
  ToastParamsType,
  ToastPromiseType
} from './types'

const DEFAULT_DURATION = 10_000

const defaultToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action, onClose, onAutoClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      onAutoClose: onAutoClose
    }
  )
}

const infoToast = ({ title, description, options = {} }: InfoToastParamsType) => {
  const { dismissible, duration, action, secondaryAction, ctaPosition, severity, onClose, onAutoClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        closeButton={dismissible}
        variant="info"
        action={action}
        secondaryAction={secondaryAction}
        ctaPosition={ctaPosition}
        severity={severity}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      onAutoClose: onAutoClose
    }
  )
}

const successToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action, onClose, onAutoClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        closeButton={dismissible}
        variant="success"
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      onAutoClose: onAutoClose
    }
  )
}

const dangerToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action, onClose, onAutoClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        variant="danger"
        description={description}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      onAutoClose: onAutoClose
    }
  )
}

const loadingToast = ({ title, options = {} }: LoadingToastParamsType) => {
  const { action, onClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        variant="loading"
        title={title}
        closeButton={false}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        action={action}
      />
    ),
    {
      duration: Number.POSITIVE_INFINITY,
      dismissible: false
    }
  )
}

const promiseToast = (
  promise: ToastPromiseType,
  { loadingMessage, successMessage, errorMessage, options = {} }: PromiseToastParamsType
) => {
  const { dismissible, action, onClose } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        variant="loading"
        title={loadingMessage}
        onClose={() => {
          sonnerToast.dismiss(t)
          onClose?.()
        }}
        closeButton={dismissible}
        promise={promise}
        action={action}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    ),
    {
      dismissible: dismissible !== false,
      duration: Number.POSITIVE_INFINITY
    }
  )
}

export const toast = Object.assign(defaultToast, {
  danger: dangerToast,
  info: infoToast,
  loading: loadingToast,
  success: successToast,
  promise: promiseToast,

  // to dismiss a toast manually
  dismiss: sonnerToast.dismiss
})
