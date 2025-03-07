import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, Dialog, Fieldset, FormWrapper, Input } from '@/components'
import { BranchSelector, BranchSelectorListItem, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { CreateBranchDialogProps, CreateBranchFormFields } from '../types'

export const makeCreateBranchFormSchema = (t: TranslationStore['t']) =>
  z.object({
    name: z
      .string()
      .nonempty(t('views:repos.createBranchDialog.validation.nameNoEmpty', 'Branch name can’t be blank'))
      .max(
        256,
        t('views:repos.createBranchDialog.validation.nameMax', 'Branch name must be no longer than 256 characters')
      )
      .regex(
        /^[a-zA-Z0-9._-\s]+$/,
        t(
          'views:repos.createBranchDialog.validation.nameRegex',
          'Branch name must contain only letters, numbers, and the characters: - _ .'
        )
      )
      .refine(
        data => !data.includes(' '),
        t('views:repos.createBranchDialog.validation.nameNoSpaces', 'Branch name cannot contain spaces')
      ),
    target: z
      .string()
      .nonempty(t('views:repos.createBranchDialog.validation.targetNoEmpty', 'Target branch can’t be blank'))
  })

export function CreateBranchDialog({
  open,
  onClose,
  onSubmit,
  isCreatingBranch,
  error,
  useTranslationStore,
  useRepoBranchesStore,
  handleChangeSearchValue
}: CreateBranchDialogProps) {
  const { t } = useTranslationStore()
  const { setSelectedBranchTag, defaultBranch } = useRepoBranchesStore()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isValid, isSubmitSuccessful }
  } = useForm<CreateBranchFormFields>({
    resolver: zodResolver(makeCreateBranchFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      target: defaultBranch ?? ''
    }
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      clearErrors()
      reset()
      setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful, onClose])

  const handleClose = () => {
    clearErrors()
    reset()
    setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
    handleChangeSearchValue('')
    onClose()
  }

  const handleSelectTargetBranch = (value: BranchSelectorListItem) => {
    setValue('target', value.name, { shouldValidate: true })
    setSelectedBranchTag(value)
  }

  useEffect(() => {
    if (defaultBranch) {
      setValue('target', defaultBranch, { shouldValidate: true })
      setSelectedBranchTag({ name: defaultBranch, sha: '' })
    }
  }, [defaultBranch, setValue])

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content className="border-border bg-background-1 max-w-[460px]" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.createBranchTitle', 'Create a branch')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Input
              id="name"
              label="Branch name"
              {...register('name')}
              maxLength={50}
              placeholder={t('views:forms.enterBranchName', 'Enter branch name')}
              size="md"
              error={
                errors.name?.message ? t('views:forms.createBranchError', errors.name?.message?.toString()) : undefined
              }
            />

            {/* TODO: Currently the search within BranchSelector is not working, we need to review the current passed states for it to work */}
            <BranchSelector
              useRepoBranchesStore={useRepoBranchesStore}
              useTranslationStore={useTranslationStore}
              onSelectBranch={handleSelectTargetBranch}
              setSearchQuery={handleChangeSearchValue}
              buttonSize="md"
              isBranchOnly
              dynamicWidth
            />
          </Fieldset>

          {error && (
            <Alert.Container variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          )}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              loading={isCreatingBranch}
              disabled={isCreatingBranch}
            >
              {t('views:repos.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isCreatingBranch || !isValid}>
              {t('views:repos.createBranchButton', 'Create branch')}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
