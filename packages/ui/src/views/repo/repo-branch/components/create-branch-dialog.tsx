import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Fieldset,
  FormWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem,
  Spacer
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
  defaultBranch
}: CreateBranchDialogProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateBranchFormFields>({
    resolver: zodResolver(createBranchFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      target: defaultBranch
    }
  })

  const processedBranches = defaultBranch
    ? branches?.some(branch => branch.name === defaultBranch)
      ? branches
      : [{ name: defaultBranch }, ...(branches || [])]
    : branches

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-background-1">
        <DialogHeader>
          <DialogTitle>{t('views:repos.createBranch', 'Create Branch')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <Input
                id="name"
                label="Branch name"
                {...register('name')}
                placeholder={t('views:forms.enterBranchName', 'Enter branch name')}
                size="md"
                error={
                  errors.name?.message
                    ? t('views:forms.createBranchError', errors.name?.message?.toString())
                    : undefined
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
                  label={t('views:forms.baseBranch', 'Base Branch')}
                  error={
                    errors.target?.message
                      ? t('views:forms.selectBranchError', errors.target?.message?.toString())
                      : undefined
                  }
                  disabled={isLoadingBranches || !branches?.length}
                >
                  <SelectContent>
                    {processedBranches?.map(
                      branch =>
                        branch?.name && (
                          <SelectItem key={branch?.name} value={branch?.name as string}>
                            {branch?.name}
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
            <ButtonGroup className="flex justify-end">
              <Button onClick={onClose} className="text-primary" variant="outline" loading={isCreatingBranch}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
              <Button type="submit">{t('views:repos.createBranch', 'Create Branch')}</Button>
            </ButtonGroup>
          </FormWrapper>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
