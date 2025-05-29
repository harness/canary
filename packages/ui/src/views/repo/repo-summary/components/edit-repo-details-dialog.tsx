import { ChangeEvent, useEffect, useState } from 'react'

import { Button, ButtonLayout, ModalDialog, Textarea } from '@/components'

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
    <ModalDialog.Root open={showEditRepoDetails} onOpenChange={onClose}>
      <ModalDialog.Content>
        <ModalDialog.Header>
          <ModalDialog.Title className="mb-4">Repository Description</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
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
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ButtonLayout>
            <ModalDialog.Close onClick={handleClose}>Cancel</ModalDialog.Close>
            <Button type="button" onClick={() => onSave(newDesc)}>
              Save
            </Button>
          </ButtonLayout>
        </ModalDialog.Footer>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
