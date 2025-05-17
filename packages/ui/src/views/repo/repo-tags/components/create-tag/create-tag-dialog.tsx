import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Dialog, Fieldset, FormInput, FormWrapper, Label, Textarea } from '@/components'
import { BranchSelectorListItem, TranslationStore } from '@/views/repo'
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
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
  selectedBranchOrTag: BranchSelectorListItem | null
  branchSelectorRenderer: () => JSX.Element | null
}

export const CreateTagDialog: FC<CreateTagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  error,
  useTranslationStore,
  isLoading = false,
  selectedBranchOrTag,
  branchSelectorRenderer: BranchSelectorContainer
}) => {
  const { t } = useTranslationStore()

  const formMethods = useForm<CreateTagFormFields>({
    resolver: zodResolver(makeCreateTagFormSchema(t)),
    mode: 'onChange',
    defaultValues: INITIAL_FORM_VALUES
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = formMethods

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
      <Dialog.Content className="border-border max-w-xl bg-cn-background-1">
        <Dialog.Header>
          <Dialog.Title className="font-medium">{t('views:repos.createTagTitle', 'Create a tag')}</Dialog.Title>
        </Dialog.Header>

        <FormWrapper<CreateTagFormFields> {...formMethods} onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <FormInput.Text
              id="name"
              label={t('views:forms.tagName', 'Name')}
              name="name"
              maxLength={250}
              placeholder={t('views:forms.enterTagName', 'Enter a tag name here')}
              disabled={isLoading}
            />
          </Fieldset>

          <Fieldset>
            <ControlGroup>
              <Label htmlFor="target" className="mb-2">
                {t('views:forms.basedOn', 'Based on')}
              </Label>
              <BranchSelectorContainer />
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <Textarea
              id="description"
              {...register('message')}
              placeholder={t('views:repos.repoTagDescriptionPlaceholder', 'Enter tag description here')}
              label={t('views:repos.description', 'Description')}
              error={errors.message?.message}
              disabled={isLoading}
            />
          </Fieldset>

          {error && (
            <Alert.Root theme="danger">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Root>
          )}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" variant="outline" onClick={handleClose} loading={isLoading} disabled={isLoading}>
              {t('views:repos.cancel', 'Cancel')}
            </Button>
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
