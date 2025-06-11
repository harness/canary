import { Children, createContext, isValidElement, ReactNode, useContext } from 'react'

import { Button, IconV2 } from '@/components'

import { Dialog } from './dialog'
import { Logo } from './logo'

export type AlertDialogTheme = 'default' | 'warning' | 'danger'
export type AlertDialogIcon = React.ComponentProps<typeof IconV2>['name']
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
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog.Root>
    </AlertDialogContext.Provider>
  )
}

const Trigger = Dialog.Trigger

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
    <Dialog.Content>
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
        {cancelEl ?? <Cancel />}
        {confirmEl ?? <Confirm />}
      </Dialog.Footer>
    </Dialog.Content>
  )
}

const Cancel = ({ children = 'Cancel', ...props }: { children?: ReactNode }) => {
  const context = useContext(AlertDialogContext)
  if (!context) throw new Error('AlertDialog.Cancel must be used within AlertDialog.Root')

  return (
    <Dialog.Close asChild>
      <Button variant="secondary" loading={context.loading} onClick={context.onCancel} {...props}>
        {children}
      </Button>
    </Dialog.Close>
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
