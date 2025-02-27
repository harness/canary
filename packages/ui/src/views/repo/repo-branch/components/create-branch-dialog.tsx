import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Dialog, Fieldset, FormWrapper, Input } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { BranchSelector } from '@views/repo/components'
import { z } from 'zod'

import { CreateBranchDialogProps, CreateBranchFormFields } from '../types'

export const createBranchFormSchema = z.object({
  name: z.string().min(1, { message: 'Branch name is required' }),
  target: z.string().min(1, { message: 'Base branch is required' })
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
    resolver: zodResolver(createBranchFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      target: ''
    }
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      clearErrors()
      reset()
      setValue('name', '', { shouldValidate: false })
      setValue('target', defaultBranch || '', { shouldValidate: false })
      setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful, open, onClose])
  const handleClose = () => {
    clearErrors()
    setValue('name', '', { shouldValidate: false })
    setValue('target', defaultBranch || '', { shouldValidate: false })
    setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
    handleChangeSearchValue('')
    onClose()
  }

  const handleSelectChange = (fieldName: keyof CreateBranchFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  useEffect(() => {
    if (defaultBranch) {
      setValue('target', defaultBranch, { shouldValidate: true })
      setSelectedBranchTag({ name: defaultBranch, sha: '' })
    }
  }, [defaultBranch, setValue])

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content className="max-w-[460px] border-border bg-background-1" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.createBranchTitle', 'Create a branch')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Input
              id="name"
              label="Branch name"
              {...register('name')}
              placeholder={t('views:forms.enterBranchName', 'Enter branch name')}
              size="md"
              error={
                errors.name?.message ? t('views:forms.createBranchError', errors.name?.message?.toString()) : undefined
              }
            />
          </Fieldset>

          <Fieldset>
            <ControlGroup>
              <BranchSelector
                useRepoBranchesStore={useRepoBranchesStore}
                useTranslationStore={useTranslationStore}
                onSelectBranch={value => {
                  handleSelectChange('target', value.name)
                  setSelectedBranchTag(value)
                }}
                setSearchQuery={handleChangeSearchValue}
                dynamicWidth
                buttonSize="md"
                isBranchOnly
              />
            </ControlGroup>
          </Fieldset>

          {error ? (
            <Alert.Container variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          ) : null}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                handleClose()
              }}
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
