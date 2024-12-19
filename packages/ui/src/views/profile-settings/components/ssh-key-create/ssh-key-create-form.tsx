import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Input, Spacer, Text, Textarea } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
      <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
        {/* NAME */}
        <Fieldset>
          <ControlGroup>
            <Input
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder="Enter the name"
              label="New SSH key"
              error={errors.identifier?.message?.toString()}
              autoFocus
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Textarea
              id="content"
              value={content}
              {...register('content')}
              label="Public key"
              error={errors.content?.message?.toString()}
            />
          </ControlGroup>
        </Fieldset>
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
        <Fieldset>
          <ControlGroup>
            <ButtonGroup className="justify-end">
              <>
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                  {!isLoading ? 'Save' : 'Saving...'}
                </Button>
              </>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </>
  )
}
