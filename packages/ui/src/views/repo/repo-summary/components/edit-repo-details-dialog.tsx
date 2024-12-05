import { ChangeEvent, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  Icon,
  Text,
  Textarea
} from '@/components'

interface EditRepoDetailsDialog {
  showEditRepoDetails: boolean
  description?: string
  onSave: (desc: string) => void
  onClose: () => void
  updateRepoError?: string
  isSubmitting: boolean
  isSubmitted: boolean
}

export const EditRepoDetails = ({
  showEditRepoDetails,
  description,
  onSave,
  onClose,
  updateRepoError,
  isSubmitting,
  isSubmitted
}: EditRepoDetailsDialog) => {
  const [newDesc, setNewDesc] = useState<string>(description || '')
  return (
    <AlertDialog open={showEditRepoDetails} onOpenChange={onClose}>
      <AlertDialogContent className="h-80 max-h-[70vh] max-w-[460px]" onOverlayClick={onClose}>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4">Repository Description</AlertDialogTitle>
        </AlertDialogHeader>
        <Text className="inline-block leading-none text-foreground-2" size={1}>
          Description
        </Text>
        <Textarea
          className="h-24 text-primary"
          value={newDesc}
          defaultValue={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setNewDesc(e?.target?.value)
          }}
          placeholder="Enter repository description here"
        />
        {updateRepoError?.length ? (
          <Text className="leading-none tracking-tight text-foreground-danger" align="center" size={1} as="p">
            {updateRepoError}
          </Text>
        ) : (
          <></>
        )}
        <AlertDialogFooter>
          <ButtonGroup>
            {!isSubmitted ? (
              <>
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="button" theme="primary" onClick={() => onSave(newDesc)} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                type="button"
                size="sm"
                theme="success"
                className="pointer-events-none flex gap-2"
                disabled={isSubmitted}
              >
                Saved
                <Icon name="tick" size={14} />
              </Button>
            )}
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
