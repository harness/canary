import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Input
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { IEditUserDialogProps } from '../types'

export const EditUserDialog: React.FC<IEditUserDialogProps> = ({
  useAdminListUsersStore,
  onClose,
  isSubmitting,
  handleUpdateUser,
  open
}) => {
  const { user } = useAdminListUsersStore()
  const newUserSchema = z.object({
    userID: z.string(),
    email: z.string().email({ message: 'Please provide a valid email, ex: example@yourcompany.com' }),
    displayName: z.string().min(1, { message: 'Please provide a display name' })
  })

  type MemberFields = z.infer<typeof newUserSchema>

  const {
    handleSubmit,
    register,
    reset: resetNewMemberForm,
    formState: { errors }
  } = useForm<MemberFields>({
    resolver: zodResolver(newUserSchema),
    mode: 'onChange'
  })

  // Form edit submit handler
  const onSubmit: SubmitHandler<MemberFields> = data => {
    handleUpdateUser(data)
    resetNewMemberForm(data)
  }

  useEffect(() => {
    resetNewMemberForm({
      userID: user?.uid,
      email: user?.email,
      displayName: user?.display_name
    })
  }, [user, resetNewMemberForm])

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update User</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Accessibility: Add Description */}
        <AlertDialogDescription>Update information for {user?.uid} and confirm changes.</AlertDialogDescription>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            {/* User ID */}
            <ControlGroup>
              <Input
                id="userID"
                {...register('userID')}
                placeholder="Enter User ID"
                value={user?.uid}
                readOnly
                className="cursor-not-allowed"
                label="User ID cannot be changed once created"
                error={errors.userID?.message?.toString()}
              />
            </ControlGroup>

            {/* EMAIL */}
            <ControlGroup>
              <Input
                id="email"
                {...register('email')}
                defaultValue={user?.email}
                label="Email"
                error={errors.email?.message?.toString()}
              />
            </ControlGroup>

            {/* Display Name */}
            <ControlGroup>
              <Input
                id="displayName"
                {...register('displayName')}
                defaultValue={user?.display_name}
                placeholder="Enter a display name"
                label="Display Name"
                error={errors.displayName?.message?.toString()}
              />
            </ControlGroup>

            {/* Footer */}
            {/* <Spacer size={5} /> */}
            <AlertDialogFooter>
              <ControlGroup>
                <ButtonGroup>
                  <>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" theme="primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                </ButtonGroup>
              </ControlGroup>
            </AlertDialogFooter>
          </Fieldset>
        </FormWrapper>
      </AlertDialogContent>
    </AlertDialog>
  )
}
