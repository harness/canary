import { ChangeEvent, FC, useState } from 'react'

import { Button, Dialog, Fieldset, FormWrapper, Input } from '@/components'

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
  const [title, setTitle] = useState(initialTitle)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isDisabled = !title || isLoading || title === initialTitle

  const handleSubmit = async () => {
    if (!title) return

    setIsLoading(true)
    setError('')

    try {
      await onSubmit(title)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>Edit PR title</Dialog.Title>
        </Dialog.Header>
        <FormWrapper>
          <Fieldset>
            <Input
              value={title}
              size="md"
              placeholder="Enter pull request title"
              label="Title"
              onFocus={event => event.target.select()}
              onChange={handleChange}
              error={error}
              autoFocus
            />
          </Fieldset>
        </FormWrapper>

        <Dialog.Footer>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" onClick={handleSubmit} disabled={isDisabled}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
