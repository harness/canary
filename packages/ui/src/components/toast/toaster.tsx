import { Icon, Layout, Toast, useToast } from '@/components'
import { cn } from '@/utils/cn'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, variant, showIcon = true, ...props }) => (
        <Toast.Root key={id} variant={variant} {...props}>
          <Layout.Horizontal gap="space-x-2.5" className="items-center">
            {showIcon && (
              <>
                {variant === 'success' && <Icon name="checkbox" className="text-icons-success" size={12} />}
                {variant === 'destructive' && (
                  <Icon name="warning-triangle-outline" size={12} className="text-toast-foreground-danger" />
                )}
                {variant === 'failed' && <Icon name="cross" className="text-icons-danger" size={12} />}
              </>
            )}
            <Layout.Horizontal gap="space-x-1">
              {!!title && <Toast.Title>{title}</Toast.Title>}
              {!!description && <Toast.Description>{description}</Toast.Description>}
            </Layout.Horizontal>
          </Layout.Horizontal>
          {action}
          {!action && (
            <Toast.Close
              className={cn(
                variant === 'destructive'
                  ? 'text-toast-icons-danger-default hover:text-toast-icons-danger-hover'
                  : 'text-icons-1 hover:text-icons-2'
              )}
            />
          )}
        </Toast.Root>
      ))}
      <Toast.Viewport />
    </>
  )
}
