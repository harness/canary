import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Dialog, Fieldset, FormWrapper, Input, Textarea } from '@/components'
import { TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface PullRequestHeaderEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (newTitle: string, newDescription: string) => void
  initialTitle: string
  initialDescription?: string
  useTranslationStore: () => TranslationStore
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
  initialDescription = '',
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialTitle,
      description: initialDescription
    }
  })

  useEffect(() => {
    reset({
      title: initialTitle,
      description: initialDescription
    })
  }, [initialTitle, initialDescription])

  const isDisabled = isSubmitting

  const onFormSubmit = (data: FormFields) => {
    onSubmit(data.title, data.description || '')
    onClose()
  }

  const handleDialogClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogClose}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>Edit PR details</Dialog.Title>
        </Dialog.Header>
        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
          <Fieldset>
            <Input
              {...register(FIELD_TITLE)}
              size="md"
              placeholder="Enter pull request title"
              label="Title"
              onFocus={event => event.target.select()}
              error={errors[FIELD_TITLE]?.message}
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
        </FormWrapper>

        <Dialog.Footer>
          <Button type="button" variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>

          <Button type="submit" onClick={handleSubmit(onFormSubmit)} disabled={isDisabled}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
