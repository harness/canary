import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Dialog, Fieldset, FormWrapper, Input, Select } from '@/components'
import { TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ICreatePipelineStore } from './types'

export const makeCreatePipelineSchema = (t: TranslationStore['t']) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('views:pipelines.createPipelineValidation.nameMin', 'Pipeline name is required') })
      .max(100, {
        message: t(
          'views:pipelines.createPipelineValidation.nameMax',
          'Pipeline name must be no longer than 100 characters'
        )
      })
      .regex(/^[a-zA-Z0-9._-\s]+$/, {
        message: t(
          'views:pipelines.createPipelineValidation.nameRegex',
          'Pipeline name must contain only letters, numbers, and the characters: - _ .'
        )
      })
      .refine(data => !data.includes(' '), {
        message: t('views:pipelines.createPipelineValidation.noSpaces', 'Pipeline name cannot contain spaces')
      }),
    branch: z.string().min(1, { message: 'Branch name is required' }),
    yamlPath: z.string().min(1, { message: 'YAML path is required' })
  })

export type CreatePipelineFormType = z.infer<ReturnType<typeof makeCreatePipelineSchema>>

interface CreatePipelineDialogProps {
  useCreatePipelineStore: () => ICreatePipelineStore
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
  onSubmit: (formValues: CreatePipelineFormType) => Promise<void>
  useTranslationStore: () => TranslationStore
}

export function CreatePipelineDialog(props: CreatePipelineDialogProps) {
  const { onCancel, onSubmit, isOpen, onClose, useCreatePipelineStore, useTranslationStore } = props
  const { t } = useTranslationStore()

  const { isLoadingBranchNames, branchNames, defaultBranch, error } = useCreatePipelineStore()

  const [errorMessage, setErrorMessage] = useState<string | undefined>(error?.message)

  // NOTE: update local state when error is changed
  useEffect(() => {
    setErrorMessage(error?.message)
  }, [error])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    trigger,
    formState: { errors, isValid }
  } = useForm<CreatePipelineFormType>({
    resolver: zodResolver(makeCreatePipelineSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      branch: defaultBranch,
      yamlPath: ''
    }
  })

  const branch = watch('branch')

  useEffect(() => {
    setValue('branch', defaultBranch ?? '')
  }, [defaultBranch, setValue])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name') {
        setValue('yamlPath', value.name ? `.harness/${value.name}.yaml` : '')

        // NOTE: validate YAML path field
        trigger('yamlPath')
      }

      if (error) {
        setErrorMessage(undefined)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, clearErrors, error, trigger])

  const handleSelectBranch = (value: string) => setValue('branch', value, { shouldValidate: true })

  const handleClose = () => {
    onCancel()
    onClose()
    reset()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Content className="max-w-xl" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>Create Pipeline</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset legend="Pipeline details">
            <Input
              id="name"
              label="Pipeline name"
              {...register('name')}
              size="md"
              error={errors.name?.message?.toString()}
            />

            <Input
              id="yamlPath"
              label="Yaml path"
              {...register('yamlPath')}
              size="md"
              error={errors.name?.message?.toString()}
            />

            <ControlGroup>
              <Select.Root
                disabled={isLoadingBranchNames}
                name="branch"
                value={branch}
                onValueChange={handleSelectBranch}
                placeholder="Select"
                label="Branch"
              >
                <Select.Content>
                  {branchNames?.map(branchName => (
                    <Select.Item key={branchName} value={branchName}>
                      {branchName}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>

          {errorMessage && (
            <Alert.Container variant="destructive">
              <Alert.Title>{errorMessage}</Alert.Title>
            </Alert.Container>
          )}

          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" onClick={handleClose} className="text-primary" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isLoadingBranchNames}>
              Create Pipeline
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
