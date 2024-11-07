import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
  Badge,
  Text,
  Input
} from '@harnessio/canary'
import { FormResetPasswordsDialogProps } from './interfaces'
import { CopyButton } from '../copy-button'
import { generateAlphaNumericHash } from '../../utils/utils'

export const FormResetPasswordDialog: React.FC<FormResetPasswordsDialogProps> = ({
  user,
  onClose,
  handleUpdatePassword
}) => {
  const [isConfirm, setIsConfirm] = useState(false)
  const [password] = useState(generateAlphaNumericHash(10))

  const handleResetPassword = () => {
    handleUpdatePassword(user!.uid!, password)
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {isConfirm ? (
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
          ) : (
            <AlertDialogTitle>
              Are you sure you want to reset password for
              <Badge type="admin" className="mx-2" variant="muted" disableHover={true}>
                <Text>{user?.display_name}</Text>
              </Badge>
              ?
            </AlertDialogTitle>
          )}
          <AlertDialogDescription>
            {isConfirm ? (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                Your password has been generated. Please make sure to copy and store your password somewhere safe, you
                won't be able to see it again.
              </Text>
            ) : (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                This will give you a new password to support {user?.display_name} ({user?.uid}) to reset the current
                password.
              </Text>
            )}
            {isConfirm && <Input id="identifier" value={password} readOnly right={<CopyButton name={password} />} />}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isConfirm ? `Close` : `Cancel`}
          </Button>
          {!isConfirm && (
            <Button
              size="default"
              theme="secondary"
              className="self-start"
              onClick={() => {
                handleResetPassword()
                setIsConfirm(true)
              }}>
              Confirm
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
