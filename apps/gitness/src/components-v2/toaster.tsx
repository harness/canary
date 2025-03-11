import { Toast, useToast } from '@harnessio/ui/components'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast.Root key={id} {...props}>
          <div className="grid gap-1">
            {!!title && <Toast.Title>{title}</Toast.Title>}
            {!!description && <Toast.Description>{description}</Toast.Description>}
          </div>
          {action}
          <Toast.Close />
        </Toast.Root>
      ))}
      <Toast.Viewport />
    </>
  )
}
