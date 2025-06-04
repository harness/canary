import { Children, createContext, isValidElement, ReactNode, useContext } from 'react'

import { Button } from './button'
import { Icon } from './icon'
import { Logo } from './logo'
import { ModalDialog } from './modal-dialog'

export type AlertDialogTheme = 'default' | 'warning' | 'danger'
export type AlertDialogIcon = React.ComponentProps<typeof Icon>['name']
export type AlertDialogLogo = React.ComponentProps<typeof Logo>['name']

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
      <ModalDialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </ModalDialog.Root>
    </AlertDialogContext.Provider>
  )
}

const Trigger = ModalDialog.Trigger

interface ContentProps {
  title: string
  children?: ReactNode
}

const Content = ({ title, children }: ContentProps) => {
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
    <ModalDialog.Content>
      <ModalDialog.Header
        icon={
          context.theme === 'danger'
            ? 'cross-circle'
            : context.theme === 'warning'
              ? 'warning-triangle-outline'
              : undefined
        }
        theme={context.theme}
      >
        <ModalDialog.Title>{title}</ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>{otherChildren}</ModalDialog.Body>

      <ModalDialog.Footer>
        {cancelEl ?? <Cancel />}
        {confirmEl ?? <Confirm />}
      </ModalDialog.Footer>
    </ModalDialog.Content>
  )
}

const Cancel = ({ children = 'Cancel', ...props }: { children?: ReactNode }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error('AlertDialog.Cancel must be used within AlertDialog.Root')

  return (
    <ModalDialog.Close asChild>
      <Button variant="secondary" loading={context.loading} onClick={context.onCancel} {...props}>
        {children}
      </Button>
    </ModalDialog.Close>
  )
}
Cancel.displayName = 'AlertDialog.Cancel'

const Confirm = ({ children = 'Confirm', ...props }: { children?: ReactNode }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error('AlertDialog.Confirm must be used within AlertDialog.Root')

  return (
    <Button
      theme={context.theme === 'danger' ? 'danger' : undefined}
      loading={context.loading}
      onClick={context.onConfirm}
      {...props}
    >
      {context.loading ? 'Loading...' : children}
    </Button>
  )
}
Confirm.displayName = 'AlertDialog.Confirm'

export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Cancel,
  Confirm
}
