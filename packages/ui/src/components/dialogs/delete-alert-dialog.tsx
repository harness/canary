import { ChangeEvent, FC, useMemo, useState } from 'react'

import { Alert, AlertDialog, Fieldset, Input } from '@/components'
import { useTranslation } from '@/context'
import { getErrorMessage } from '@utils/utils'

export interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier?: string
  deleteFn: (id: string) => void
  type?: string
  isLoading?: boolean
  error?: { type?: string; message: string } | null
  withForm?: boolean
  message?: string
  deletionKeyword?: string
}

export const DeleteAlertDialog: FC<DeleteAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type,
  isLoading = false,
  error,
  withForm = false,
  message,
  deletionKeyword = 'DELETE'
}) => {
  const { t } = useTranslation()
  const [verification, setVerification] = useState('')

  const handleChangeVerification = (event: ChangeEvent<HTMLInputElement>) => {
    setVerification(event.target.value)
  }

  const isDisabled = isLoading || (withForm && verification !== deletionKeyword)

  const handleDelete = () => {
    if (isDisabled) return

    deleteFn(identifier!)
  }

  const displayMessageContent = useMemo(() => {
    if (message) return message

    if (type) {
      return t(
        'component:deleteDialog.descriptionWithType',
        `This will permanently delete your ${type} and remove all data. This action cannot be undone.`,
        { type: type }
      )
    }
    return t(
      'component:deleteDialog.description',
      `This will permanently remove all data. This action cannot be undone.`
    )
  }, [type, t, message])

  return (
    <AlertDialog.Root theme="danger" open={open} onOpenChange={onClose} onConfirm={handleDelete} loading={isLoading}>
      <AlertDialog.Content title={t('component:deleteDialog.title', 'Are you sure?')}>
        {displayMessageContent}
        {withForm && (
          <Fieldset>
            <Input
              id="verification"
              value={verification}
              placeholder=""
              onChange={handleChangeVerification}
              label={`${t('component:deleteDialog.inputLabel', `To confirm, type`)} "${deletionKeyword}"`}
              disabled={isLoading}
              autoFocus
            />
          </Fieldset>
        )}

        {!!error && (
          <Alert.Root className="mt-4" theme="danger">
            <Alert.Title>Failed to perform delete operation</Alert.Title>
            <Alert.Description>
              {getErrorMessage(error as Error, 'Failed to perform delete operation')}
            </Alert.Description>
          </Alert.Root>
        )}

        <AlertDialog.Cancel />
        <AlertDialog.Confirm>Yes, delete {type}</AlertDialog.Confirm>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
