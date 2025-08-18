import { ChangeEvent, FC, useMemo, useState } from 'react'

import { Alert, AlertDialog, Message, MessageTheme, Text, TextInput } from '@/components'
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
  const [validationError, setValidationError] = useState(false)

  const handleChangeVerification = (event: ChangeEvent<HTMLInputElement>) => {
    setVerification(event.target.value)
    if (validationError) {
      setValidationError(false)
    }
  }

  const handleDelete = () => {
    if (withForm && verification !== deletionKeyword) {
      setValidationError(true)
    }

    if (isLoading || (withForm && verification !== deletionKeyword)) return

    setValidationError(false)
    deleteFn(identifier!)
  }

  const handleOpenChange = () => {
    setTimeout(() => {
      setVerification('')
      setValidationError(false)
    }, 300)
    onClose()
  }

  const displayMessageContent = useMemo(() => {
    if (message) return message

    const replaceText = '__IDENTIFIER__'

    if (type) {
      const text = t(
        'component:deleteDialog.descriptionWithType',
        `This will permanently delete your ${type} ${replaceText} and remove all data. This action cannot be undone.`,
        { type: type, identifier: replaceText }
      )

      const parts = text.split(replaceText)

      return (
        <>
          {parts[0]}
          {identifier && (
            <Text as="span" variant="body-strong">
              {identifier}
            </Text>
          )}
          {parts[1]}
        </>
      )
    }

    return t(
      'component:deleteDialog.description',
      `This will permanently remove all data. This action cannot be undone.`
    )
  }, [type, t, message, identifier])

  return (
    <AlertDialog.Root
      theme="danger"
      open={open}
      onOpenChange={handleOpenChange}
      onConfirm={handleDelete}
      loading={isLoading}
    >
      <AlertDialog.Content title={t('component:deleteDialog.title', 'Are you sure?')}>
        <Text className="break-words" wrap="wrap">
          {displayMessageContent}
        </Text>

        {withForm && (
          <TextInput
            id="verification"
            value={verification}
            placeholder=""
            onChange={handleChangeVerification}
            label={`${t('component:deleteDialog.inputLabel', `To confirm, type`)} "${deletionKeyword}"`}
            disabled={isLoading}
            autoFocus
            error={
              validationError
                ? t('component:deleteDialog.validation.mismatch', `Please type "${deletionKeyword}" to confirm`, {
                    deletionKeyword
                  })
                : ''
            }
          />
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
          <Alert.Root theme="danger">
            <Alert.Title>Failed to perform delete operation</Alert.Title>
            <Alert.Description>
              {getErrorMessage(error as Error, 'Failed to perform delete operation')}
            </Alert.Description>
          </Alert.Root>
        )}

        <AlertDialog.Cancel />
        <AlertDialog.Confirm disabled={violation && !bypassable}>
          {violation && bypassable ? `Bypass rules and delete` : `Yes`}
        </AlertDialog.Confirm>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
