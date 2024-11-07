import React from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
  Input,
  Text
} from '@harnessio/canary'
import { useNavigate } from 'react-router-dom'
import { CopyButton } from '../copy-button'

export const ResetPasswordDialog = ({
  isOpen,
  onClose,
  password
}: {
  isOpen: boolean
  onClose: () => void
  password: string
}) => {
  const navigate = useNavigate()
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Password</AlertDialogTitle>
          <AlertDialogDescription>
            <Text as="div" color="tertiaryBackground" className="mb-4">
              Your password has been generated. Please make sure to copy and store your password somewhere safe, you
              won't be able to see it again.
            </Text>
            <Input id="identifier" value={password} readOnly right={<CopyButton name={password} />} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              navigate('../users')
            }}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
