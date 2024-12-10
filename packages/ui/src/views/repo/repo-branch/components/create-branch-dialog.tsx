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

import { CreateBranchFormFields } from '../types'

export interface Branch {
  name?: string
}

export interface CreateBranchDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (formValues: CreateBranchFormFields) => void
  isLoadingBranches: boolean
  branches?: Array<Branch>
  error?: string
  isCreatingBranch?: boolean
}

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
  error
}: CreateBranchDialogProps) {
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
      target: ''
    }
  })

  const targetValue = watch('target')

  const handleSelectChange = (fieldName: keyof CreateBranchFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle>Create Branch</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <Input
                id="name"
                label="Branch name"
                {...register('name')}
                placeholder="Enter branch name"
                size="md"
                error={errors.name?.message?.toString()}
              />
            </Fieldset>

            <Fieldset>
              <ControlGroup>
                <Select
                  name="target"
                  value={targetValue}
                  onValueChange={value => handleSelectChange('target', value)}
                  placeholder="Select"
                  label="Base Branch"
                  error={errors.target?.message?.toString()}
                  disabled={isLoadingBranches || !branches?.length}
                >
                  <SelectContent>
                    {branches?.map(
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
                <Alert.Title>Error: {error}</Alert.Title>
              </Alert.Container>
            ) : null}
            <ButtonGroup className="flex justify-end">
              <Button onClick={onClose} className="text-primary" variant="outline" loading={isCreatingBranch}>
                Cancel
              </Button>
              <Button type="submit">Create Branch</Button>
            </ButtonGroup>
          </FormWrapper>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
