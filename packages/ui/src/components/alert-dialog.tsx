import { Children, createContext, forwardRef, isValidElement, ReactNode, useContext } from 'react'

import { Button, ButtonLayout, IconV2NamesType } from '@/components'

import { Dialog } from './dialog'
import { LogoV2NamesType } from './logo-v2'

export type AlertDialogTheme = 'default' | 'warning' | 'danger'
export type AlertDialogIcon = IconV2NamesType
export type AlertDialogLogo = LogoV2NamesType

export interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCancel?: () => void
  onConfirm: () => void
  theme?: 'default' | 'warning' | 'danger'
  loading?: boolean
  children: React.ReactNode
}

interface AlertDialogContextProps {
  onCancel?: () => void
  onConfirm: () => void
  theme: AlertDialogTheme
  loading: boolean
}

const AlertDialogContext = createContext<AlertDialogContextProps | null>(null)

const Root = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  theme = 'default',
  loading = false,
  children
}: AlertDialogProps) => {
  return (
    <AlertDialogContext.Provider value={{ onCancel, onConfirm, theme, loading }}>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog.Root>
    </AlertDialogContext.Provider>
  )
}

const Trigger = Dialog.TriggerPrimitive

interface ContentProps {
  title: string
  children?: ReactNode
}

const Content = forwardRef<HTMLDivElement, ContentProps>(({ title, children }, ref) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error('AlertDialog.Content must be used within AlertDialog.Root')

  let cancelEl: ReactNode = null
  let confirmEl: ReactNode = null
  const otherChildren: ReactNode[] = []

  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      otherChildren.push(child)
      return
    }

    if ((child.type as any).displayName === 'AlertDialog.Cancel') {
      cancelEl = child
    } else if ((child.type as any).displayName === 'AlertDialog.Confirm') {
      confirmEl = child
    } else {
      otherChildren.push(child)
    }
  })

  return (
    <Dialog.Content onOpenAutoFocus={event => event.preventDefault()} ref={ref}>
      <Dialog.Header
        icon={
          context.theme === 'danger' ? 'xmark-circle' : context.theme === 'warning' ? 'warning-triangle' : undefined
        }
        theme={context.theme}
      >
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body>{otherChildren}</Dialog.Body>

      <Dialog.Footer>
        <ButtonLayout>
          {cancelEl ?? <Cancel />}
          {confirmEl ?? <Confirm />}
        </ButtonLayout>
      </Dialog.Footer>
    </Dialog.Content>
  )
})
Content.displayName = 'AlertDialog.Content'

const Cancel = forwardRef<HTMLButtonElement, { children?: ReactNode }>(({ children = 'Cancel', ...props }, ref) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error('AlertDialog.Cancel must be used within AlertDialog.Root')

  return (
    <Dialog.Close asChild>
      <Button variant="secondary" disabled={context.loading} onClick={context.onCancel} ref={ref} {...props}>
        {children}
      </Button>
    </Dialog.Close>
  )
})
Cancel.displayName = 'AlertDialog.Cancel'

const Confirm = forwardRef<HTMLButtonElement, { children?: ReactNode; disabled?: boolean }>(
  ({ children = 'Confirm', ...props }, ref) => {
    const context = useContext(AlertDialogContext)
    if (!context) throw new Error('AlertDialog.Confirm must be used within AlertDialog.Root')

    return (
      <Button
        ref={ref}
        theme={context.theme === 'danger' ? 'danger' : undefined}
        loading={context.loading}
        onClick={context.onConfirm}
        {...props}
      >
        {context.loading ? 'Loading...' : children}
      </Button>
    )
  }
)
Confirm.displayName = 'AlertDialog.Confirm'

export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Cancel,
  Confirm
}
