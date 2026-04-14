import { FC } from 'react'

// Direct imports to avoid circular dependency with context barrel
import { Alert } from '../alert'
import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Dialog } from '../dialog'

export interface ExitConfirmOptions {
  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  error?: string
  isLoading?: boolean
}

export type ExitConfirmDialogProps = ExitConfirmOptions & { open: boolean }

export const ExitConfirmDialog: FC<ExitConfirmDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  title = 'Unsaved changes',
  subtitle = 'You have unsaved changes that will be lost if you leave now.',
  confirmText = 'Leave anyway',
  cancelText = 'Keep editing',
  error,
  isLoading = false
}) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={open => {
        if (!open) onCancel?.()
      }}
    >
      <Dialog.Content className="max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>{subtitle}</Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={() => onCancel?.()} disabled={isLoading}>
              {cancelText}
            </Dialog.Close>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Loading...' : confirmText}
            </Button>
          </ButtonLayout>
          {error && (
            <Alert.Root>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          )}
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
