import { Button, ButtonGroup, Input, Textarea, Spacer, Text } from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormFieldSet } from '@harnessio/playground'

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  content: z.string().min(1, { message: 'Please add the public key' })
})

export type SshKeyFormType = z.infer<typeof formSchema>

interface SshKeyCreateFormProps {
  apiError?: string | null
  isLoading?: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
}

export function SshKeyCreateForm({ isLoading, handleCreateSshKey, onClose, error }: SshKeyCreateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SshKeyFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      content: ''
    }
  })

  const content = watch('content')
  const identifier = watch('identifier')

  const handleFormSubmit: SubmitHandler<SshKeyFormType> = data => {
    handleCreateSshKey(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* NAME */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="identifier" required>
              New SSH key
            </FormFieldSet.Label>
            <Input
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder="Enter the name"
              autoFocus
            />
            {errors.identifier && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.identifier.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="content" required>
              Public key
            </FormFieldSet.Label>
            <Textarea id="content" value={content} {...register('content')} />
            {errors.identifier && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.identifier.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
        <>
          {error && error.type === 'keyCreate' && (
            <>
              <Text size={1} className="text-destructive">
                {error.message}
              </Text>
              <Spacer size={4} />
            </>
          )}
        </>
        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root className="justify-end">
              <>
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                  {!isLoading ? 'Save' : 'Saving...'}
                </Button>
              </>
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
