import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  ControlGroup,
  Dialog,
  FormWrapper,
  Input,
  Message,
  MessageTheme,
  Select,
  SelectContent,
  SelectItem
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
    resolver: zodResolver(createPipelineSchema),
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
      <Dialog.Content className="max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title>Create Pipeline</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name"
              label="Pipeline name *"
              {...register('name')}
              size="md"
              error={errors.name?.message?.toString()}
            />
            <Input
              id="yamlPath"
              label="Yaml path *"
              {...register('yamlPath')}
              size="md"
              error={errors.name?.message?.toString()}
            />
            <ControlGroup>
              <Select
                disabled={isLoadingBranchNames}
                name="branch"
                value={branch}
                onValueChange={value => handleSelectChange('branch', value)}
                placeholder="Select"
                label="Branch *"
              >
                <SelectContent>
                  {branchNames?.map(branchName => (
                    <SelectItem key={branchName} value={branchName}>
                      {branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlGroup>
            <Message className="mt-0.5" theme={MessageTheme.ERROR}>
              {errorMessage}
            </Message>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => {
                  onCancel()
                  reset()
                }}
                className="text-primary"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isLoadingBranchNames}>
                Create Pipeline
              </Button>
            </div>
          </FormWrapper>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
