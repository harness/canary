import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon
} from '@harnessio/canary'

interface DeleteTokenAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier: string
  deleteFn: (id: string) => void
  type: string
}
export const DeleteTokenAlertDialog: React.FC<DeleteTokenAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type
}) => {
  //   const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      {/* <AlertDialogTrigger asChild>
        <div className="flex gap-1.5 items-center justify-end cursor-pointer" onClick={() => setIsDialogOpen(true)}>
          <Icon name="trash" size={14} className="text-tertiary-background" />
        </div>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your {type} and remove all data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {/* )} */}
          {/* {deleteSuccess ? (
            <Button size="default" theme="success" className="self-start pointer-events-none">
              Project deleted&nbsp;&nbsp;
              <Icon name="tick" size={14} />
            </Button>
          ) : ( */}
          <Button
            size="default"
            theme="error"
            className="self-start"
            variant="destructive"
            onClick={() => {
              deleteFn(identifier)
              onClose()
            }} /*disabled={isDeleting}*/
          >
            {/* {isDeleting ? 'Deleting project...' : 'Yes, delete project'} */}
            {`Yes, delete ${type}`}
          </Button>
          {/* )} */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
