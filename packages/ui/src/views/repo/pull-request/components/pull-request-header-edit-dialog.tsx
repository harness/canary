import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Dialog, Fieldset, FormInput, FormWrapper } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface PullRequestHeaderEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (newTitle: string) => Promise<void>
  initialTitle: string
}

export const PullRequestHeaderEditDialog: FC<PullRequestHeaderEditDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialTitle
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formMethods = useForm<{ title: string }>({
    resolver: zodResolver(z.object({ title: z.string().min(1, { message: 'Please provide a title' }) })),
    mode: 'onChange',
    defaultValues: { title: initialTitle }
  })

  const { register, handleSubmit } = formMethods

  const handleFormSubmit = async (data: { title: string }) => {
    console.log(data)

    if (!data.title) return

    setIsLoading(true)

    try {
      await onSubmit(data.title)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content aria-describedby={undefined}>
        <FormWrapper {...formMethods} onSubmit={handleSubmit(handleFormSubmit)} id="edit-pr-title-form">
          <Dialog.Header>
            <Dialog.Title>Edit PR title</Dialog.Title>
          </Dialog.Header>
          <Fieldset>
            <FormInput.Text
              id="title"
              {...register('title')}
              placeholder="Enter pull request title"
              label="Title"
              onFocus={event => event.target.select()}
              autoFocus
            />
            {error && <p className="text-cn-foreground-danger">{error}</p>}
          </Fieldset>

          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
