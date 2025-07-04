import { ChangeEvent, useEffect, useState } from 'react'

import { Button, ButtonLayout, Dialog, Textarea } from '@/components'

interface EditRepoDetailsDialog {
  showEditRepoDetails: boolean
  description: string
  onSave: (desc: string) => void
  onClose: () => void
  updateRepoError?: string
}

export const EditRepoDetails = ({
  showEditRepoDetails,
  description,
  onSave,
  onClose,
  updateRepoError
}: EditRepoDetailsDialog) => {
  const [newDesc, setNewDesc] = useState<string>(description)
  const handleClose = () => {
    setNewDesc(description || '')
    onClose()
  }
  useEffect(() => {
    setNewDesc(description)
  }, [description])
  return (
    <Dialog.Root open={showEditRepoDetails} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="mb-4">Repository Description</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Textarea
            label="Description"
            className="h-24 text-cn-foreground-1"
            value={newDesc}
            defaultValue={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setNewDesc(e?.target?.value)
            }}
            placeholder="Enter repository description here"
            error={updateRepoError?.length ? updateRepoError : undefined}
          />
        </Dialog.Body>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={handleClose}>Cancel</Dialog.Close>
            <Button type="button" onClick={() => onSave(newDesc)}>
              Save
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
