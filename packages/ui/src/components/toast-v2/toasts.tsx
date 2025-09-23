import { toast as sonnerToast } from 'sonner'

import { CustomToast } from './custom-toast'
import { ToastParamsType } from './types'

const defaultToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className, closeButton } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={closeButton}
      />
    ),
    {
      duration: duration || Number.POSITIVE_INFINITY,
      dismissible: dismissible !== false,
      position,
      action
    }
  )
}

const infoToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className, closeButton } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={closeButton}
        variant="info"
      />
    ),
    {
      duration: duration || Number.POSITIVE_INFINITY,
      dismissible: dismissible !== false,
      position,
      action
    }
  )
}

const successToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className, closeButton } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        title={title}
        className={className}
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
        closeButton={closeButton}
        variant="success"
      />
    ),
    {
      duration: duration || Number.POSITIVE_INFINITY,
      dismissible: dismissible !== false,
      position,
      action
    }
  )
}

const dangerToast = ({ title, description, options = {} }: ToastParamsType) => {
  const { dismissible, duration, position, action, className } = options
  return sonnerToast.custom(
    t => (
      <CustomToast
        title={title}
        className={className}
        variant="danger"
        description={description}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ),
    {
      duration: duration || Number.POSITIVE_INFINITY,
      dismissible: dismissible !== false,
      position,
      action
    }
  )
}

export const toast = Object.assign(defaultToast, {
  danger: dangerToast,
  info: infoToast,
  success: successToast
})
