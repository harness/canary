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
  SelectItem
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
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
  branches,
  isLoadingBranches,
  isCreatingBranch,
  error,
  useTranslationStore,
  defaultBranch,
  handleChangeSearchValue
}: CreateBranchDialogProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors, isValid }
  } = useForm<CreateBranchFormFields>({
    resolver: zodResolver(createBranchFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      target: ''
    }
  })

  const handleClose = () => {
    resetField('name')
    resetField('target', { defaultValue: defaultBranch })
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

  const handleSelectChange = (fieldName: keyof CreateBranchFormFields, value: string) => {
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
              <Select
                name="target"
                value={targetValue || defaultBranch}
                onValueChange={value => handleSelectChange('target', value)}
                placeholder={t('views:forms.select', 'Select')}
                label={t('views:forms.baseBranch', 'Base branch')}
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

          {error ? (
            <Alert.Container variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          ) : null}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button variant="outline" onClick={onClose} loading={isCreatingBranch} disabled={isCreatingBranch}>
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
