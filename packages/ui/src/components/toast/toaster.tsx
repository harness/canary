import { IconV2, Layout, Toast, useToast } from '@/components'
import { cn } from '@/utils/cn'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, variant, showIcon = true, ...props }) => (
        <Toast.Root key={id} variant={variant} {...props}>
          <Layout.Horizontal gap="xs" align="center">
            {showIcon && (
              <>
                {variant === 'success' && <IconV2 name="check" className="text-icons-success" size="2xs" />}
                {variant === 'destructive' && (
                  // --cn-comp-toast-danger-bg --cn-comp-toast-danger-text
                  <IconV2 name="warning-triangle" size="2xs" className="text-toast-foreground-danger" />
                )}
                {variant === 'failed' && <IconV2 name="xmark" className="text-icons-danger" size="2xs" />}
              </>
            )}
            <Layout.Horizontal gap="xs" align="center">
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
