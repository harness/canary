import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FormWrapper,
  Input,
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
  const {
    onCancel,
    onSubmit,
    isLoadingBranchNames,
    branchNames,
    isLoadingDefaultBranch,
    defaultBranch,
    isOpen,
    onClose
  } = props

  const {
    register,
    handleSubmit,
    setValue,
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
    setValue('branch', defaultBranch)
  }, [defaultBranch, setValue])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name') {
        setValue('yamlPath', value.name ? `.harness/${value.name}.yaml` : '')

        // NOTE: validate YAML path field
        trigger('yamlPath')
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, clearErrors])

  const handleSelectChange = (fieldName: keyof CreatePipelineFormType, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle>Create Pipeline</DialogTitle>
        </DialogHeader>
        <DialogDescription>
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
                disabled={isLoadingBranchNames || isLoadingDefaultBranch}
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
            <div className="flex justify-end gap-3">
              <Button type="button" onClick={onCancel} className="text-primary" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isLoadingBranchNames || isLoadingDefaultBranch}>
                Create Pipeline
              </Button>
            </div>
          </FormWrapper>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
