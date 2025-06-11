import { FC } from 'react'

import { Button, ButtonLayout, Dialog } from '@/components'

export interface ExitConfirmOptions {
  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
}

export type ExitConfirmDialogProps = ExitConfirmOptions & { open: boolean }

export const ExitConfirmDialog: FC<ExitConfirmDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  title = 'You have unsaved changes',
  subtitle = 'Are you sure you want to leave this page without saving?',
  confirmText = 'Leave',
  cancelText = 'Stay'
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
          <Dialog.Description>{subtitle}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={() => onCancel?.()}>{cancelText}</Dialog.Close>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
