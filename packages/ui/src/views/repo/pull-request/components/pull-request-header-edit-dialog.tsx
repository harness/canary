import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Dialog, Fieldset, FormInput, FormWrapper, Textarea } from '@/components'
import { TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface PullRequestHeaderEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (newTitle: string, newDescription: string) => void
  initialTitle: string
  initialDescription?: string
  useTranslationStore?: () => TranslationStore
}

// Field names as constants to avoid lint warnings with string literals
const FIELD_TITLE = 'title'
const FIELD_DESCRIPTION = 'description'

const formSchema = z.object({
  [FIELD_TITLE]: z.string().min(1, { message: 'Title is required' }),
  [FIELD_DESCRIPTION]: z.string().optional()
})

type FormFields = z.infer<typeof formSchema>

export const PullRequestHeaderEditDialog: FC<PullRequestHeaderEditDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialTitle,
  initialDescription = ''
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formMethods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { title: initialTitle, description: initialDescription }
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = formMethods

  const handleFormSubmit = async (data: FormFields) => {
    if (!data.title) return

    setIsLoading(true)

    try {
      onSubmit(data.title, data.description || '')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = isSubmitting || isLoading

  useEffect(() => {
    reset({
      title: initialTitle,
      description: initialDescription
    })
  }, [initialTitle, initialDescription, reset])

  const handleDialogClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogClose}>
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
          </Fieldset>
          <Fieldset>
            <Textarea
              {...register(FIELD_DESCRIPTION)}
              placeholder="Enter pull request description"
              label="Description"
              rows={5}
              error={errors[FIELD_DESCRIPTION]?.message}
            />
          </Fieldset>

          {error && <p className="text-cn-foreground-danger">{error}</p>}

          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isDisabled}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
