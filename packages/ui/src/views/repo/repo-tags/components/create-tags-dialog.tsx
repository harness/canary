import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ControlGroup,
  Dialog,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  Textarea
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { BranchSelector } from '@views/repo/components'
// import { BranchSelector } from '@views/repo/components'
import { TranslationStore } from '@views/repo/repo-list/types'
import { IBranchSelectorStore } from '@views/repo/repo.types'
import { z } from 'zod'

interface CreateTagDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTagFromFields) => void
  //   branches?: { name: string }[]
  branchQuery?: string
  setBranchQuery: (query: string) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  isLoadingBranches?: boolean
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
  isLoadingBranches,
  error,
  useTranslationStore,
  isLoading,
  branchQuery,
  setBranchQuery
}: CreateTagDialogProps) {
  const { t } = useTranslationStore()
  const { branchList: branches, defaultBranch } = useRepoBranchesStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    clearErrors()
    reset()
    setValue('name', '', { shouldValidate: false })
    setValue('target', defaultBranch || '', { shouldValidate: false })

    if (isSubmitSuccessful) {
      clearErrors()
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful, open, onClose])
  const handleClose = () => {
    clearErrors()
    setValue('name', '', { shouldValidate: false })
    setValue('target', defaultBranch || '', { shouldValidate: false })
    onClose()
  }

  const processedBranches = useMemo(
    () =>
      defaultBranch
        ? branches?.some(branch => branch.name === defaultBranch)
          ? branches
          : [{ name: defaultBranch }, ...(branches || [])]
        : branches,
    [branches, defaultBranch]
  )

  const targetValue = watch('target')

  const handleSelectChange = (fieldName: keyof CreateTagFromFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  useEffect(() => {
    if (defaultBranch) {
      setValue('target', defaultBranch, { shouldValidate: true })
    }
  }, [defaultBranch, setValue])

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content className="max-w-[460px] border-border bg-background-1" aria-describedby={undefined}>
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
              <Label htmlFor="target" className="mb-2.5">
                Based on
              </Label>
              <BranchSelector
                useRepoBranchesStore={useRepoBranchesStore}
                useTranslationStore={useTranslationStore}
                onSelectBranch={value => handleSelectChange('target', value.name)}
                isBranchOnly={true}
                searchQuery={branchQuery}
                setSearchQuery={setBranchQuery}
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
              variant="outline"
              onClick={() => {
                clearErrors()
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
