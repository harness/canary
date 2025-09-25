import { toast as sonnerToast } from 'sonner'

import { CustomToast } from './custom-toast'
import { LoadingToastParamsType, PromiseToastParamsType, ToastParamsType, ToastPromiseType } from './types'

const DEFAULT_DURATION = 10_000

const defaultToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false
    }
  )
}

const infoToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        variant="info"
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false
    }
  )
}

const successToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        variant="success"
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false
    }
  )
}

const dangerToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        variant="danger"
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false
    }
  )
}

const loadingToast = ({ title, options = {} }: LoadingToastParamsType) => {
  const { action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        variant="loading"
        title={title}
        closeButton={false}
        onClose={() => sonnerToast.dismiss(t)}
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
  const { dismissible, action } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        variant="loading"
        title={loadingMessage}
        onClose={() => sonnerToast.dismiss(t)}
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
