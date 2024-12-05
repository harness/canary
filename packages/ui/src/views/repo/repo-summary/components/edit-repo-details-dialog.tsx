import { ChangeEvent, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  Textarea
} from '@/components'

interface EditRepoDetailsDialog {
  showEditRepoDetails: boolean
  description?: string
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
  const [newDesc, setNewDesc] = useState<string>(description || '')
  const handleClose = () => {
    setNewDesc(description || '')
    onClose()
  }
  return (
    <AlertDialog open={showEditRepoDetails} onOpenChange={onClose}>
      <AlertDialogContent className="h-80 max-h-[70vh] max-w-[460px]" onOverlayClick={handleClose}>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4">Repository Description</AlertDialogTitle>
        </AlertDialogHeader>
        <span className="inline-block leading-none text-foreground-7 text-14">Description</span>
        <Textarea
          className="h-24 text-primary"
          value={newDesc}
          defaultValue={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setNewDesc(e?.target?.value)
          }}
          placeholder="Enter repository description here"
          error={updateRepoError?.length ? updateRepoError : undefined}
        />
        <AlertDialogFooter>
          <ButtonGroup>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" theme="primary" onClick={() => onSave(newDesc)}>
              Save
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
