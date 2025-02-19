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
  Select,
  SelectContent,
  SelectItem,
  Textarea
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo/repo-list/types'
import { z } from 'zod'

interface CreateTagDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateTagFromFields) => void
  //   branches?: { name: string }[]
  branches?: any[]
  isLoadingBranches?: boolean
  error?: string
  useTranslationStore: () => TranslationStore
  defaultBranch?: string
  handleChangeSearchValue: (value: string) => void
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
  branches,
  isLoadingBranches,
  error,
  useTranslationStore,
  defaultBranch,
  handleChangeSearchValue,
  isLoading
}: CreateTagDialogProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors, isValid, isSubmitSuccessful }
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
    handleChangeSearchValue('')
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
              <Select
                name="target"
                value={targetValue || defaultBranch}
                onValueChange={value => handleSelectChange('target', value)}
                placeholder={t('views:forms.select', 'Select')}
                label={t('views:forms.baseTag', 'Based on')}
                error={
                  errors.target?.message
                    ? t('views:forms.selectBranchError', errors.target?.message?.toString())
                    : undefined
                }
                disabled={isLoadingBranches || !branches?.length}
              >
                <SelectContent
                  withSearch
                  searchProps={{
                    placeholder: t('views:repos.search', 'Search'),
                    searchValue: '',
                    handleChangeSearchValue
                  }}
                >
                  {processedBranches?.map(
                    branch =>
                      branch?.name && (
                        <SelectItem key={branch.name} value={branch.name as string}>
                          <span className="flex items-center gap-1.5">
                            <Icon name="branch" size={14} />
                            {branch.name}
                          </span>
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
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
