import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonLayout, Dialog, FormInput, FormWrapper } from '@/components'
import { UsererrorError } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export interface CommitSuggestionsFormType {
  message?: string
  title: string
}

const commitSuggestionsSchema = z.object({
  message: z.string().optional(),
  title: z.string()
})

export type CommitSuggestionsFormFields = z.infer<typeof commitSuggestionsSchema>

export interface CommitSuggestionsDialogProps {
  isOpen: boolean
  commitTitlePlaceHolder?: string
  // TODO: We need to decide how to display errors from the API.
  error?: UsererrorError
  onClose: () => void
  onFormSubmit: (formValues: CommitSuggestionsFormType) => Promise<void>
  isSubmitting: boolean
}

export const CommitSuggestionsDialog: FC<CommitSuggestionsDialogProps> = ({
  isOpen,
  onClose,
  commitTitlePlaceHolder,
  onFormSubmit,
  isSubmitting
}) => {
  const formMethods = useForm<CommitSuggestionsFormFields>({
    resolver: zodResolver(commitSuggestionsSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      title: commitTitlePlaceHolder
    }
  })

  const { register, handleSubmit } = formMethods

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Commit Changes</Dialog.Title>
        </Dialog.Header>

        <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)} className="block">
          <Dialog.Body>
            <FormInput.Text
              id="title"
              label="Commit Message"
              {...register('title')}
              placeholder={commitTitlePlaceHolder ?? 'Add a commit message'}
            />

            <FormInput.Textarea
              id="message"
              {...register('message')}
              placeholder="Add an optional extended description"
              label="Extended description"
              className="h-44"
            />
          </Dialog.Body>

          <Dialog.Footer>
            <ButtonLayout>
              <Dialog.Close onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Committing...' : 'Commit changes'}
              </Button>
            </ButtonLayout>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
