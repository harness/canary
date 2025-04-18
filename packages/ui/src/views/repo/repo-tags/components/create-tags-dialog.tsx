import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Dialog, Fieldset, FormWrapper, Input, Label, Textarea } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { BranchSelector } from '@views/repo/components'
import { TranslationStore } from '@views/repo/repo-list/types'
import { IBranchSelectorStore } from '@views/repo/repo.types'
import { z } from 'zod'

interface CreateTagDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTagFromFields) => void
  branchQuery?: string
  setBranchQuery: (query: string) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  error?: string
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
}

export const createTagFormSchema = z.object({
  name: z.string().min(1, { message: 'Tag name is required' }),
  target: z.string().min(1, { message: 'Base branch is required' }),
  message: z.string().min(1, { message: 'Description is required' })
})

export type CreateTagFromFields = z.infer<typeof createTagFormSchema>

export function CreateTagDialog({
  open,
  onClose,
  onSubmit,
  useRepoBranchesStore,
  error,
  useTranslationStore,
  isLoading,
  branchQuery,
  setBranchQuery
}: CreateTagDialogProps) {
  const { t } = useTranslationStore()
  const { defaultBranch, setSelectedBranchTag } = useRepoBranchesStore()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitSuccessful }
  } = useForm<CreateTagFromFields>({
    resolver: zodResolver(createTagFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      target: ''
    }
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      setValue('name', '', { shouldValidate: false })
      setValue('target', defaultBranch || '', { shouldValidate: false })
      setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
      clearErrors()
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful, open, onClose])
  const handleClose = () => {
    clearErrors()
    setValue('name', '', { shouldValidate: false })
    setValue('target', defaultBranch || '', { shouldValidate: false })
    setSelectedBranchTag({ name: defaultBranch || '', sha: '' })
    onClose()
  }

  const handleSelectChange = (fieldName: keyof CreateTagFromFields, value: string) => {
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
      <Dialog.Content className="border-cn-borders-2 bg-cn-background-1 max-w-[460px]" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.createTagTitle', 'Create a tag')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Input
              id="name"
              label="Tag name"
              {...register('name')}
              placeholder={t('views:forms.enterTagName', 'Enter tag name')}
              size="md"
              error={
                errors.name?.message ? t('views:forms.createBranchError', errors.name?.message?.toString()) : undefined
              }
            />
          </Fieldset>

          <Fieldset>
            <ControlGroup>
              <Label htmlFor="target" className="mb-2">
                Based on
              </Label>
              <BranchSelector
                useRepoBranchesStore={useRepoBranchesStore}
                useTranslationStore={useTranslationStore}
                onSelectBranch={value => {
                  handleSelectChange('target', value.name)
                  setSelectedBranchTag(value)
                }}
                searchQuery={branchQuery}
                setSearchQuery={setBranchQuery}
                dynamicWidth
              />
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <Textarea
              id="description"
              {...register('message')}
              placeholder={t('views:repos.repoTagDescriptionPlaceholder', 'Enter a description of this tag...')}
              label={t('views:repos.description', 'Description')}
              error={errors.message?.message?.toString()}
            />
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
              type="button"
              variant="surface"
              theme="muted"
              onClick={() => {
                clearErrors()
                reset({
                  name: '',
                  target: defaultBranch || ''
                })
                onClose()
              }}
              loading={isLoading}
              disabled={isLoading}
            >
              {t('views:repos.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
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
