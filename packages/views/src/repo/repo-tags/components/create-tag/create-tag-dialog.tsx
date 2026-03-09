import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, ControlGroup, Dialog, FormInput, FormWrapper, Label } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { BranchSelectorListItem } from '@views/repo'
import { CreateTagFormFields, makeCreateTagFormSchema } from '@views/repo/repo-tags/components/create-tag/schema'
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
  selectedBranchOrTag?: BranchSelectorListItem
  branchSelectorRenderer: () => JSX.Element | null
  violation?: boolean
  bypassable?: boolean
  resetViolation: () => void
}

export const CreateTagDialog: FC<CreateTagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  error,
  isLoading = false,
  selectedBranchOrTag,
  branchSelectorRenderer: BranchSelectorContainer,
  violation = false,
  bypassable = false,
  resetViolation
}) => {
  const { t } = useTranslation()

  const formMethods = useForm<CreateTagFormFields>({
    resolver: zodResolver(makeCreateTagFormSchema(t)),
    mode: 'onChange',
    defaultValues: INITIAL_FORM_VALUES
  })

  const { register, handleSubmit, setValue, reset, clearErrors, watch } = formMethods

  const resetForm = useCallback(() => {
    clearErrors()
    reset(INITIAL_FORM_VALUES)
  }, [clearErrors, reset])

  const tagName = watch('name')

  useEffect(() => {
    resetViolation()
  }, [tagName, resetViolation])

  useEffect(() => {
    if (open && selectedBranchOrTag) {
      setValue('target', selectedBranchOrTag.name, { shouldValidate: true })
    }
  }, [open, resetForm, selectedBranchOrTag, setValue])

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open, resetForm])

  const handleClose = () => {
    resetForm()
    resetViolation()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content className="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">{t('views:repos.createTagTitle', 'Create a tag')}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <FormWrapper<CreateTagFormFields> id="create-tag-form" {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            <FormInput.Text
              id="name"
              label={t('views:forms.tagName', 'Name')}
              name="name"
              maxLength={250}
              placeholder={t('views:forms.enterTagName', 'Enter a tag name here')}
              disabled={isLoading}
              autoFocus
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
            {violation && (
              <Alert.Root theme="warning">
                <Alert.Description className="overflow-hidden break-all">
                  {bypassable
                    ? t(
                        'component:tagDialog.violationMessages.bypassed',
                        'Some rules will be bypassed while creating tag'
                      )
                    : t('component:tagDialog.violationMessages.notAllow', "Some rules don't allow you to create tag")}
                </Alert.Description>
              </Alert.Root>
            )}

            {error && (
              <Alert.Root theme="danger">
                <Alert.Description className="overflow-hidden break-all">
                  {t('views:repos.error', 'Error:')} {error}
                </Alert.Description>
              </Alert.Root>
            )}
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={handleClose} disabled={isLoading}>
              {t('views:repos.cancel', 'Cancel')}
            </Dialog.Close>
            {!bypassable || !violation ? (
              <Button
                type="submit"
                form="create-tag-form"
                disabled={isLoading || (!bypassable && violation)}
                loading={isLoading}
              >
                {isLoading
                  ? t('views:repos.creatingTagButton', 'Creating tag...')
                  : !bypassable && violation
                    ? t('component:tagDialog.notAllowed', 'Cannot create tag')
                    : t('views:repos.createTagButton', 'Create tag')}
              </Button>
            ) : (
              <Button type="submit" form="create-tag-form" variant="outline" theme="danger">
                {isLoading
                  ? t('views:repos.creatingTagButton', 'Creating tag...')
                  : t('component:tagDialog.bypassButton', 'Bypass rules and create tag')}
              </Button>
            )}
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
