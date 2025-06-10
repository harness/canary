import { ChangeEvent, FC, useState } from 'react'

import { AlertDialog, Fieldset, Input } from '@/components'
import { useTranslation } from '@/context'

const DELETION_KEYWORD = 'DELETE'

export interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier?: string
  deleteFn: (id: string) => void
  type?: string
  isLoading?: boolean
  error?: { type?: string; message: string } | null
  withForm?: boolean
}

export const DeleteAlertDialog: FC<DeleteAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type,
  isLoading = false,
  error,
  withForm = false
}) => {
  const { t } = useTranslation()
  const [verification, setVerification] = useState('')

  const handleChangeVerification = (event: ChangeEvent<HTMLInputElement>) => {
    setVerification(event.target.value)
  }

  const isDisabled = isLoading || (withForm && verification !== DELETION_KEYWORD)

  const handleDelete = () => {
    if (isDisabled) return

    deleteFn(identifier!)
  }

  return (
    <AlertDialog.Root theme="danger" open={open} onOpenChange={onClose} onConfirm={handleDelete} loading={isLoading}>
      <AlertDialog.Content title={t('component:deleteDialog.title', 'Are you sure?')}>
        {type
          ? t(
              'component:deleteDialog.descriptionWithType',
              `This will permanently delete your ${type} and remove all data. This action cannot be undone.`,
              { type: type }
            )
          : t(
              'component:deleteDialog.description',
              `This will permanently remove all data. This action cannot be undone.`
            )}
        {withForm && (
          <Fieldset>
            <Input
              id="verification"
              value={verification}
              placeholder=""
              onChange={handleChangeVerification}
              label={`${t('component:deleteDialog.inputLabel', `To confirm, type`)} “${DELETION_KEYWORD}”`}
              disabled={isLoading}
              autoFocus
            />
          </Fieldset>
        )}

        {!!error && error.message && <p className="text-2 text-cn-foreground-danger">{error.message}</p>}

        <AlertDialog.Cancel />
        <AlertDialog.Confirm>Yes, delete {type}</AlertDialog.Confirm>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
