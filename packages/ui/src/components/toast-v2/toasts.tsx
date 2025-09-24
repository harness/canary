import { toast as sonnerToast } from 'sonner'

import { CustomToast } from './custom-toast'
import { LoadingToastParamsType, PromiseToastParamsType, ToastParamsType, ToastPromiseType } from './types'

const DEFAULT_DURATION = 10_000

const defaultToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      position
    }
  )
}

const infoToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        variant="info"
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      position
    }
  )
}

const successToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        variant="success"
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      position
    }
  )
}

const dangerToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        className={className}
        variant="danger"
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        action={action}
      />
    ),
    {
      duration: duration || DEFAULT_DURATION,
      dismissible: dismissible !== false,
      position
    }
  )
}

const loadingToast = ({ title, options = {} }: LoadingToastParamsType) => {
  const { position, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        variant="loading"
        title={title}
        className={className}
        closeButton={false}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ),
    {
      dismissible: false,
      position
    }
  )
}

const promiseToast = (promise: ToastPromiseType, { title, description, options = {} }: PromiseToastParamsType) => {
  const { dismissible, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        toastId={t}
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={dismissible}
        variant="loading"
        promise={promise}
        action={action}
      />
    ),
    {
      dismissible: dismissible !== false,
      position
    }
  )
}

export const toast = Object.assign(defaultToast, {
  danger: dangerToast,
  info: infoToast,
  loading: loadingToast,
  success: successToast,
  promise: promiseToast
})
