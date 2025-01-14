import { ChangeEvent, FC, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Fieldset,
  Input,
  Spacer,
  Text
} from '@/components'
import { TranslationStore } from '@views/repo'

const DELETE = 'DELETE'

export interface DeleteAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier?: string
  deleteFn: (id: string) => void
  type?: string
  isLoading?: boolean
  error?: { type: string; message: string } | null
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

  const isDisabled = isLoading || (withForm && verification !== DELETE)

  const handleDelete = () => {
    if (isDisabled) return

    deleteFn(identifier!)
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('component:deleteDialog.title', 'Are you sure?')}</AlertDialogTitle>
          <AlertDialogDescription>
            {type
              ? t('component:deleteDialog.descriptionWithType', {
                  defaultValue: `This will permanently delete your ${type} and remove all data. This action cannot be undone.`,
                  type: type
                })
              : t(
                  'component:deleteDialog.description',
                  `This will permanently remove all data. This action cannot be undone.`
                )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {withForm && (
          <Fieldset>
            <Input
              id="verification"
              value={verification}
              placeholder=""
              onChange={handleChangeVerification}
              label={`${t('component:deleteDialog.inputLabel', `To confirm, type`)} “${DELETE}”`}
              disabled={isLoading}
              autoFocus
            />
          </Fieldset>
        )}
        {!!error && (error.type === 'tokenDelete' || error.type === 'keyDelete') && (
          <>
            <Text size={1} className="text-destructive">
              {error.message}
            </Text>
            <Spacer size={4} />
          </>
        )}
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('component:deleteDialog.cancel', 'Cancel')}
          </Button>
          <Button variant="destructive" disabled={isDisabled} onClick={handleDelete}>
            {isLoading ? `Deleting ${type}...` : `Yes, delete ${type}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
