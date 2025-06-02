import { FC } from 'react'

import { Button, ButtonLayout, ModalDialog } from '@/components'

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
    <ModalDialog.Root
      open={open}
      onOpenChange={open => {
        if (!open) onCancel?.()
      }}
    >
      <ModalDialog.Content className="max-w-[500px]">
        <ModalDialog.Header>
          <ModalDialog.Title>{title}</ModalDialog.Title>
          <ModalDialog.Description>{subtitle}</ModalDialog.Description>
        </ModalDialog.Header>
        <ModalDialog.Footer>
          <ButtonLayout>
            <ModalDialog.Close onClick={() => onCancel?.()}>{cancelText}</ModalDialog.Close>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </ButtonLayout>
        </ModalDialog.Footer>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
