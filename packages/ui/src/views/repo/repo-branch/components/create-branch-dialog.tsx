import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, Dialog, Fieldset, FormWrapper, Input, Message, MessageTheme } from '@/components'
import { BranchSelector, BranchSelectorListItem, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeValidationUtils } from '@utils/validation'
import { z } from 'zod'

import { CreateBranchDialogProps, CreateBranchFormFields } from '../types'

export const makeCreateBranchFormSchema = (t: TranslationStore['t']) => {
  const { required, maxLength, specialSymbols, noSpaces } = makeValidationUtils(t)

  return z.object({
    name: z
      .string()
      .trim()
      .nonempty(required(t('views:repos.createBranchDialog.branchNameLabel')))
      .max(...maxLength(256, t('views:repos.createBranchDialog.branchNameLabel')))
      .regex(...specialSymbols(t('views:repos.createBranchDialog.branchNameLabel')))
      .refine(...noSpaces(t('views:repos.createBranchDialog.branchNameLabel'))),
    target: z.string().nonempty(required(t('views:repos.createBranchDialog.validation.target', 'Target branch')))
  })
}

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
  const { setSelectedBranchTag, defaultBranch = '' } = useRepoBranchesStore()

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
      target: defaultBranch
    }
  })

  const handleClose = () => {
    clearErrors()
    reset()
    setSelectedBranchTag({ name: defaultBranch, sha: '' })
    handleChangeSearchValue('')
    onClose()
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleClose()
    }
  }, [isSubmitSuccessful])

  const handleSelectTargetBranch = (value: BranchSelectorListItem) => {
    setValue('target', value.name, { shouldValidate: true })
    setSelectedBranchTag(value)
  }

  useEffect(() => {
    if (open && defaultBranch) {
      handleSelectTargetBranch({ name: defaultBranch, sha: '' })
    }
  }, [open, defaultBranch])

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
              label={t('views:repos.createBranchDialog.branchNameLabel', 'Branch name')}
              {...register('name')}
              maxLength={50}
              placeholder={t('views:repos.createBranchDialog.branchNamePlaceholder', 'Enter branch name')}
              size="md"
              error={errors.name?.message?.toString()}
            />

            <div className="grid">
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

              {!!errors.target && (
                <Message className="mt-0.5" theme={MessageTheme.ERROR}>
                  {errors.target.message}
                </Message>
              )}
            </div>
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
