import { ChangeEvent, FC, useMemo, useState } from 'react'

import { Alert, AlertDialog, Fieldset, Input, Message, MessageTheme } from '@/components'
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
  violation?: boolean
  bypassable?: boolean
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
  deletionKeyword = 'DELETE',
  violation = false,
  bypassable = false
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
        `This will permanently delete your ${type} ${identifier} and remove all data. This action cannot be undone.`,
        { type: type, identifier: identifier }
      )
    }
    return t(
      'component:deleteDialog.description',
      `This will permanently remove all data. This action cannot be undone.`
    )
  }, [type, t, message, identifier])

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

        {violation && (
          <Message theme={MessageTheme.ERROR}>
            {bypassable
              ? t(
                  'component:deleteDialog.violationMessages.bypassed',
                  `Some rules will be bypassed while deleting ${type}`,
                  { type: type }
                )
              : t('component:deleteDialog.violationMessages.notAllow', `Some rules don't allow you to delete ${type}`, {
                  type: type
                })}
          </Message>
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
        <AlertDialog.Confirm disabled={violation && !bypassable}>
          {violation && bypassable ? `Bypass rules and delete ${type}` : `Yes, delete ${type}`}
        </AlertDialog.Confirm>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
