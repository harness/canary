import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonLayout, ControlGroup, FormInput, FormWrapper, ModalDialog } from '@/components'
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
    <ModalDialog.Root open={isOpen} onOpenChange={onClose}>
      <ModalDialog.Content className="max-w-[576px]">
        <ModalDialog.Header>
          <ModalDialog.Title>Commit Changes</ModalDialog.Title>
        </ModalDialog.Header>

        <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)} className="block">
          <ModalDialog.Body>
            <ControlGroup className="space-y-7 mb-7">
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
              />
            </ControlGroup>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ButtonLayout>
              <ModalDialog.Close onClick={onClose} disabled={isSubmitting}>
                Cancel
              </ModalDialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Committing...' : 'Commit changes'}
              </Button>
            </ButtonLayout>
          </ModalDialog.Footer>
        </FormWrapper>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
