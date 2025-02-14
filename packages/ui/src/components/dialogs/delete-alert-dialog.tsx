import { ChangeEvent, FC, useState } from 'react'

import { AlertDialog, Button, Fieldset, Input } from '@/components'
import { TranslationStore } from '@views/repo'

const DELETION_KEYWORD = 'DELETE'

export interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier?: string
  deleteFn: (id: string) => void
  type?: string
  isLoading?: boolean
  error?: { type?: string; message: string } | null
  useTranslationStore: () => TranslationStore
  withForm?: boolean
}

export const DeleteAlertDialog: FC<DeleteAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type,
  isLoading = false,
  useTranslationStore,
  error,
  withForm = false
}) => {
  const { t } = useTranslationStore()
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
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Content onOverlayClick={onClose} onClose={onClose}>
        <AlertDialog.Header>
          <AlertDialog.Title>{t('component:deleteDialog.title', 'Are you sure?')}</AlertDialog.Title>
          <AlertDialog.Description>
            {type
              ? t('component:deleteDialog.descriptionWithType', {
                  defaultValue: `This will permanently delete your ${type} and remove all data. This action cannot be undone.`,
                  type: type
                })
              : t(
                  'component:deleteDialog.description',
                  `This will permanently remove all data. This action cannot be undone.`
                )}
          </AlertDialog.Description>
        </AlertDialog.Header>
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

        {!!error && error.message && <p className="text-xs text-destructive">{error.message}</p>}

        <AlertDialog.Footer>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('component:deleteDialog.cancel', 'Cancel')}
          </Button>
          <Button variant="destructive" disabled={isDisabled} onClick={handleDelete}>
            {isLoading ? `Deleting ${type}...` : `Yes, delete ${type}`}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
