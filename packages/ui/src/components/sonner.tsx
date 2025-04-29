import { ComponentProps } from 'react'

import { toast as sonnerToast, Toaster } from 'sonner'

import { Button } from './button'
import { Layout } from './layout'

// https://sonner.emilkowal.ski/toast

type ToasterProps = ComponentProps<typeof Toaster>

const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <Toaster
      className="toaster group"
      // toastOptions={{
      //   classNames: {
      //     toast:
      //       'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      //     description: 'group-[.toast]:text-muted-foreground',
      //     actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
      //     cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
      //   }
      // }}
      {...props}
    />
  )
}

function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(id => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={{
        label: toast.button.label,
        onClick: () => console.log('Button clicked')
      }}
    />
  ))
}

// An attempt to render the toast content from packages/ui/src/components/toast/toaster.tsx
function Toast(props: ToastProps) {
  const { title, description, id } = props

  return (
    <div className="border-cn-borders-2 bg-cn-background-3 pointer-events-auto relative flex min-h-11 w-full justify-between gap-x-[18px] overflow-hidden rounded border p-3 shadow-lg transition-all">
      <Layout.Horizontal gap="space-x-2.5" className="items-center">
        {withIndicator && (
          <div className="self-start py-[5px]">
            {variant === 'success' && <Icon name="checkbox" className="text-icons-success" {...commonIconProps} />}
            {variant === 'destructive' && (
              <Icon name="warning-triangle-outline" className="text-toast-foreground-danger" {...commonIconProps} />
            )}
            {variant === 'failed' && <Icon name="cross" className="text-icons-danger" {...commonIconProps} />}
          </div>
        )}
        <Layout.Vertical gap={cn('space-y-1', { 'line-clamp-3': !withFullHeight })} ref={makeHandleContentRef(id)}>
          {!!title && <Toast.Title>{title}</Toast.Title>}
          {!!description && <Toast.Description>{description}</Toast.Description>}
        </Layout.Vertical>
      </Layout.Horizontal>

      <Layout.Vertical gap="space-y-1" className="items-end justify-between">
        {!action && (
          <Toast.Close
            variant="ghost"
            className={cn(
              variant === 'destructive'
                ? 'text-toast-icons-danger-default hover:text-toast-icons-danger-hover'
                : 'text-icons-1 hover:text-icons-2'
            )}
          />
        )}

        {action}

        {withShowButton && (
          <Button variant="link" onClick={makeToggleShowButton(id)} className="min-w-fit self-end">
            {withFullHeight
              ? t('component:toaster.showLess', 'Show less')
              : t('component:toaster.showMore', 'Show more')}
          </Button>
        )}
      </Layout.Vertical>
    </div>
  )
}

interface ToastProps {
  id: string | number
  title: string
  description: string
  button: {
    label: string
    onClick: () => void
  }
}

export { Sonner }
