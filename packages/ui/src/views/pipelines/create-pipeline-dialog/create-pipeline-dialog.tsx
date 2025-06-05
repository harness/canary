import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonLayout,
  Fieldset,
  FormWrapper,
  Input,
  ModalDialog,
  SelectV2,
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
    <ModalDialog.Root
      open={isOpen}
      onOpenChange={() => {
        onClose()
        reset()
      }}
    >
      <ModalDialog.Content aria-describedby={undefined}>
        <ModalDialog.Header>
          <ModalDialog.Title>Create Pipeline</ModalDialog.Title>
        </ModalDialog.Header>
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)} className="block">
          <ModalDialog.Body>
            <div className="mb-7 space-y-7">
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

              <SelectV2
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
            </div>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ButtonLayout>
              <ModalDialog.Close
                onClick={() => {
                  onCancel()
                  reset()
                }}
              >
                Cancel
              </ModalDialog.Close>
              <Button type="submit" disabled={isLoadingBranchNames}>
                Create Pipeline
              </Button>
            </ButtonLayout>
          </ModalDialog.Footer>
        </FormWrapper>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
