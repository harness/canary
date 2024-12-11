import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components'

export interface ExitConfirmOptions {
  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
}

export type ExitConfirmDialogProps = ExitConfirmOptions & { open: boolean }

export const ExitConfirmDialog = ({
  open,
  onCancel,
  onConfirm,
  title = 'You have unsaved changes',
  subtitle = 'Are you sure you want to leave this page without saving?',
  confirmText = 'Leave',
  cancelText = 'Stay'
}: ExitConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) onCancel?.()
      }}
    >
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{subtitle}</DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onCancel?.()}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
