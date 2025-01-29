import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, Dialog, Input, Textarea } from '@/components'
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
    formState: { errors, isValid }
  } = useForm<CommitSuggestionsFormFields>({
    resolver: zodResolver(commitSuggestionsSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      title: commitTitlePlaceHolder
    }
  })

  const isDisabledSubmission = isSubmitting || !isValid

  const onSubmit: SubmitHandler<CommitSuggestionsFormFields> = data => {
    if (isDisabledSubmission) return

    onFormSubmit(data as CommitSuggestionsFormType)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[576px]">
        <Dialog.Header>
          <Dialog.Title>Commit Changes</Dialog.Title>
        </Dialog.Header>

        <form className="flex flex-col gap-y-7 pb-4" onSubmit={handleSubmit(onSubmit)}>
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
        </form>

        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isDisabledSubmission}>
                {isSubmitting ? 'Committing...' : 'Commit changes'}
              </Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
