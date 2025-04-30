import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Dialog, FormWrapper, Input, Textarea } from '@/components'
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
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CommitSuggestionsFormFields>({
    resolver: zodResolver(commitSuggestionsSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      title: commitTitlePlaceHolder
    }
  })

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[576px]">
        <Dialog.Header>
          <Dialog.Title>Commit Changes</Dialog.Title>
        </Dialog.Header>

        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
          <ControlGroup className="gap-y-7 pb-4">
            <Input
              id="title"
              label="Commit Message"
              {...register('title')}
              placeholder={commitTitlePlaceHolder ?? 'Add a commit message'}
              size="md"
              error={errors.title?.message?.toString()}
            />
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Add an optional extended description"
              label="Extended description"
              error={errors.message?.message?.toString()}
            />
          </ControlGroup>

          <Dialog.Footer className="-mx-5 -mb-5">
            <ButtonGroup>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Committing...' : 'Commit changes'}
              </Button>
            </ButtonGroup>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
