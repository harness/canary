import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  Dialog,
  Fieldset,
  FormWrapper,
  Input,
  Select,
  SelectValueOption
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { CreatePipelineDialogProps, CreatePipelineFormType } from './types'

const createPipelineSchema = z.object({
  name: z.string().min(1, { message: 'Pipeline name is required' }),
  branch: z.string().min(1, { message: 'Branch name is required' }),
  yamlPath: z.string().min(1, { message: 'YAML path is required' })
})

export function CreatePipelineDialog(props: CreatePipelineDialogProps) {
  const { onCancel, onSubmit, isOpen, onClose, useCreatePipelineStore } = props

  const { isLoadingBranchNames, branchNames, defaultBranch, error } = useCreatePipelineStore()

  const [errorMessage, setErrorMessage] = useState<string | undefined>(error?.message)

  // NOTE: update local state when error is changed
  useEffect(() => {
    setErrorMessage(error?.message)
  }, [error])

  const formMethods = useForm<CreatePipelineFormType>({
    resolver: zodResolver(createPipelineSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      branch: defaultBranch,
      yamlPath: ''
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    trigger,
    formState: { errors }
  } = formMethods

  const branch = watch('branch')

  const branchOptions: SelectValueOption[] =
    branchNames?.map(branchName => ({ label: branchName, value: branchName })) ?? []

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

  const handleSelectChange = (fieldName: keyof CreatePipelineFormType, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        onClose()
        reset()
      }}
    >
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>Create Pipeline</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <FormWrapper id="create-pipline-form" {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <Input
                id="name"
                label="Pipeline name"
                {...register('name')}
                size="md"
                error={errors.name?.message?.toString()}
              />
            </Fieldset>

            <Fieldset>
              <Input
                id="yamlPath"
                label="Yaml path"
                {...register('yamlPath')}
                size="md"
                error={errors.yamlPath?.message?.toString()}
              />
            </Fieldset>

            <Select
              label="Branch"
              placeholder="Select"
              options={branchOptions}
              value={branch}
              onChange={value => handleSelectChange('branch', value)}
              disabled={isLoadingBranchNames}
            />

            {errorMessage && (
              <Alert.Root theme="danger">
                <Alert.Title>{errorMessage}</Alert.Title>
              </Alert.Root>
            )}
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close
              onClick={() => {
                onCancel()
                reset()
              }}
              disabled={isLoadingBranchNames}
            >
              Cancel
            </Dialog.Close>
            <Button type="submit" form="create-pipline-form" disabled={isLoadingBranchNames}>
              Create Pipeline
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
