import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Text
} from '@/components'
import { generateAlphaNumericHash } from '@/utils/utils'

import { CopyButton } from '@harnessio/ui/components'

import { IResetPasswordDialogProps } from '../types'

export const ResetPasswordDialog: React.FC<IResetPasswordDialogProps> = ({
  open,
  user,
  onClose,
  handleUpdatePassword
}) => {
  const [isConfirm, setIsConfirm] = useState(false)
  const [password] = useState(generateAlphaNumericHash(10))

  const handleResetPassword = () => {
    handleUpdatePassword(user?.uid ?? '', password)
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {isConfirm ? (
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
          ) : (
            <AlertDialogTitle>
              Are you sure you want to reset password for
              {user?.display_name}?
            </AlertDialogTitle>
          )}
          <AlertDialogDescription>
            {isConfirm ? (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                Your password has been generated. Please make sure to copy and store your password somewhere safe, you
                won&apos;t be able to see it again.
              </Text>
            ) : (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                A new password will be generated to assist {user?.display_name} in resetting their current password.
              </Text>
            )}
            {isConfirm && (
              <Input id="identifier" value={password} readOnly rightElement={<CopyButton name={password} />} />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isConfirm ? `Close` : `Cancel`}
          </Button>
          {!isConfirm && (
            <Button
              size="default"
              variant="secondary"
              className="self-start"
              onClick={() => {
                handleResetPassword()
                setIsConfirm(true)
              }}
            >
              Confirm
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
