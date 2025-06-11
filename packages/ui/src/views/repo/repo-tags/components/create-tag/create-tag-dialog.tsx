import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Dialog, FormInput, FormWrapper, Label } from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorListItem } from '@/views/repo'
import { CreateTagFormFields, makeCreateTagFormSchema } from '@/views/repo/repo-tags/components/create-tag/schema'
import { zodResolver } from '@hookform/resolvers/zod'

const INITIAL_FORM_VALUES: CreateTagFormFields = {
  name: '',
  target: '',
  message: ''
}

interface CreateTagDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTagFormFields) => void
  error?: string
  isLoading?: boolean
  selectedBranchOrTag: BranchSelectorListItem | null
  branchSelectorRenderer: () => JSX.Element | null
}

export const CreateTagDialog: FC<CreateTagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  error,
  isLoading = false,
  selectedBranchOrTag,
  branchSelectorRenderer: BranchSelectorContainer
}) => {
  const { t } = useTranslation()

  const formMethods = useForm<CreateTagFormFields>({
    resolver: zodResolver(makeCreateTagFormSchema(t)),
    mode: 'onChange',
    defaultValues: INITIAL_FORM_VALUES
  })

  const { register, handleSubmit, setValue, reset, clearErrors } = formMethods

  const resetForm = useCallback(() => {
    clearErrors()
    reset(INITIAL_FORM_VALUES)
  }, [clearErrors, reset])

  useEffect(() => {
    if (open) {
      resetForm()

      if (selectedBranchOrTag) {
        setValue('target', selectedBranchOrTag.name, { shouldValidate: true })
      }
    }
  }, [open, resetForm, selectedBranchOrTag, setValue])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="font-medium">{t('views:repos.createTagTitle', 'Create a tag')}</Dialog.Title>
        </Dialog.Header>

        <FormWrapper<CreateTagFormFields> {...formMethods} onSubmit={handleSubmit(onSubmit)} className="block">
          <Dialog.Body>
            <div className="space-y-7 mb-7">
              <FormInput.Text
                id="name"
                label={t('views:forms.tagName', 'Name')}
                name="name"
                maxLength={250}
                placeholder={t('views:forms.enterTagName', 'Enter a tag name here')}
                disabled={isLoading}
              />

              <ControlGroup>
                <Label htmlFor="target">{t('views:forms.basedOn', 'Based on')}</Label>
                <BranchSelectorContainer />
              </ControlGroup>

              <FormInput.Textarea
                id="description"
                {...register('message')}
                placeholder={t('views:repos.repoTagDescriptionPlaceholder', 'Enter tag description here')}
                label={t('views:repos.description', 'Description')}
                disabled={isLoading}
              />

              {error && (
                <Alert.Root theme="danger">
                  <Alert.Title>
                    {t('views:repos.error', 'Error:')} {error}
                  </Alert.Title>
                </Alert.Root>
              )}
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close onClick={handleClose} loading={isLoading} disabled={isLoading}>
              {t('views:repos.cancel', 'Cancel')}
            </Dialog.Close>
            <Button type="submit" disabled={isLoading} loading={isLoading}>
              {isLoading
                ? t('views:repos.creatingTagButton', 'Creating tag...')
                : t('views:repos.createTagButton', 'Create tag')}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
