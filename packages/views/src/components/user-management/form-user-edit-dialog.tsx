import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  Icon,
  Input,
  Spacer,
  Text
} from '@harnessio/canary'

import { FormFieldSet, MessageTheme } from '../..'
import { FormEditDialogProps } from './interfaces'

export const FormUserEditDialog: React.FC<FormEditDialogProps> = ({
  user,
  onSave,
  onClose,
  isSubmitting,
  submitted,
  handleUpdateUser
}) => {
  const newUserSchema = z.object({
    userID: z.string().min(1, { message: 'Please provide a project name' }),
    email: z.string().min(1, { message: 'Please provide a valid email, ex: example@yourcompany.com' }),
    displayName: z.string().min(0, { message: 'optional' })
  })

  type MemberFields = z.infer<typeof newUserSchema>

  const {
    handleSubmit,
    register,
    reset: resetNewMemberForm,
    formState: { errors, isValid, isDirty }
  } = useForm<MemberFields>({
    resolver: zodResolver(newUserSchema),
    mode: 'onChange',
    defaultValues: {
      userID: user.uid,
      email: user.email,
      displayName: user.display_name
    }
  })

  // Form edit submit handler
  const onSubmit: SubmitHandler<MemberFields> = data => {
    handleUpdateUser(data)
    onSave()
    resetNewMemberForm(data)
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update User</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Accessibility: Add Description */}
        <AlertDialogDescription>Update the information for {user.uid} and confirm the changes.</AlertDialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root className="mb-0">
            {/* User ID */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label className="flex content-center items-center" htmlFor="userID" required>
                <Text className="text-primary/80 font-normal">User ID</Text>
                <Icon name="info-circle" height={15} className="text-tertiary-background ml-3" />
                <Text size={1} className="text-tertiary-background ml-1">
                  User ID cannot be changed once created
                </Text>
              </FormFieldSet.Label>
              <Input
                id="userID"
                {...register('userID')}
                placeholder="Enter User ID"
                defaultValue={user.uid}
                className={user.uid ? 'cursor-not-allowed' : ''}
                disabled={user.uid ? true : false}
              />
              {errors.userID && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.userID.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* EMAIL */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="email" required>
                Email
              </FormFieldSet.Label>
              <Input id="email" {...register('email')} defaultValue={user.email} />
              {errors.email && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.email.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* Display Name */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="displayName">Display Name</FormFieldSet.Label>
              <Input
                id="displayName"
                {...register('displayName')}
                defaultValue={user.display_name}
                placeholder="Enter a display name"
              />
              {errors.displayName && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.displayName.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* Footer */}
            <Spacer size={5} />
            <FormFieldSet.ControlGroup>
              <AlertDialogFooter>
                <ButtonGroup.Root>
                  {!submitted ? (
                    <>
                      <Button variant="outline" onClick={onClose} disabled={!isValid || isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" theme="primary" disabled={!isValid || isSubmitting || !isDirty}>
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
                      disabled={submitted}
                    >
                      Saved
                      <Icon name="tick" size={14} />
                    </Button>
                  )}
                </ButtonGroup.Root>
              </AlertDialogFooter>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
