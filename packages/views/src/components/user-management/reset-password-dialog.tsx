import { useNavigate } from 'react-router-dom'

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
} from '@harnessio/canary'
import { CopyButton } from '@harnessio/ui/components'

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
              won&apos;t be able to see it again.
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
            }}
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
