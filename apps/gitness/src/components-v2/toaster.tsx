import { Icon, Toast, useToast } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, variant, showIcon = true, ...props }) => (
        <Toast.Root key={id} variant={variant} {...props}>
          <div className="flex flex-row items-center gap-2.5">
            {showIcon && (
              <div>
                {variant === 'success' && <Icon name="checkbox" className="text-icons-success" size={12} />}
                {variant === 'destructive' && (
                  <Icon name="warning-triangle-outline" size={12} className="text-icons-2" />
                )}
                {variant === 'failed' && <Icon name="cross" className="text-icons-danger" size={12} />}
              </div>
            )}
            <div className="flex flex-row items-center gap-1">
              {!!title && <Toast.Title>{title}</Toast.Title>}
              {!!description && <Toast.Description>{description}</Toast.Description>}
            </div>
          </div>
          {action}
          {!action && <Toast.Close className={cn(variant === 'destructive' ? 'text-icons-2' : 'text-icons-1')} />}
        </Toast.Root>
      ))}
      <Toast.Viewport />
    </>
  )
}
