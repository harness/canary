import { ChangeEvent, useEffect, useState } from 'react'

import { AlertDialog, Button, ButtonGroup, Icon, Textarea } from '@/components'

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
    <AlertDialog.Root open={showEditRepoDetails} onOpenChange={onClose}>
      <AlertDialog.Content className="h-80 max-h-[70vh] w-[460px] !rounded" onOverlayClick={handleClose}>
        <AlertDialog.Header>
          <AlertDialog.Title className="mb-4">
            Repository Description
            <Button
              className="absolute right-1 top-1 text-icons-4 hover:text-icons-2"
              variant="custom"
              size="icon"
              onClick={handleClose}
            >
              <Icon name="close" size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </AlertDialog.Title>
        </AlertDialog.Header>
        <Textarea
          label="Description"
          className="h-24 text-primary"
          value={newDesc}
          defaultValue={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setNewDesc(e?.target?.value)
          }}
          placeholder="Enter repository description here"
          error={updateRepoError?.length ? updateRepoError : undefined}
        />
        <AlertDialog.Footer>
          <ButtonGroup>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" theme="primary" onClick={() => onSave(newDesc)}>
              Save
            </Button>
          </ButtonGroup>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
