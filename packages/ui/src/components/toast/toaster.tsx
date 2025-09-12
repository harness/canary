import { IconV2, Layout, Toast, useToast } from '@/components'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, variant, showIcon = true, ...props }) => (
        <Toast.Root key={id} variant={variant} {...props}>
          <Layout.Horizontal gap="xs" align="center">
            {showIcon && (
              <>
                {variant === 'success' && <IconV2 name="check" color="success" size="2xs" />}
                {variant === 'destructive' && <IconV2 name="warning-triangle" size="2xs" color="danger" />}
                {variant === 'failed' && <IconV2 name="xmark" color="danger" size="2xs" />}
              </>
            )}
            <Layout.Horizontal gap="xs" align="center">
              {!!title && <Toast.Title>{title}</Toast.Title>}
              {!!description && <Toast.Description>{description}</Toast.Description>}
            </Layout.Horizontal>
          </Layout.Horizontal>
          {action}
          {!action && <Toast.Close />}
        </Toast.Root>
      ))}
      <Toast.Viewport />
    </>
  )
}
