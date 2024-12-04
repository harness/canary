import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer
} from '@harnessio/canary'

import { FormFieldSet, MessageTheme } from '../..'
import { FormEditDialogProps } from './interfaces'

export const FormEditMemberDialog: React.FC<FormEditDialogProps> = ({
  member,
  onSave,
  onClose,
  isSubmitting,
  submitted
}) => {
  const newMemberSchema = z.object({
    memberName: z.string().min(1, { message: 'Please provide a project name' }),
    role: z.string().min(1, { message: 'Please select a role for the new member' })
  })

  type MemberFields = z.infer<typeof newMemberSchema>

  //member form handling
  const {
    handleSubmit,
    setValue,
    register,
    reset: resetNewMemberForm,
    formState: { errors, isValid, dirtyFields },
    watch
  } = useForm<MemberFields>({
    resolver: zodResolver(newMemberSchema),
    mode: 'onChange',
    defaultValues: {
      memberName: member.display_name,
      role: member.role
    }
  })

  const newMemberRoleValue = watch('role')

  // Form submit handler
  const onSubmit: SubmitHandler<MemberFields> = data => {
    onSave(data.role) // Pass the new role and event on save
    if (submitted) {
      resetNewMemberForm() // Reset the form after submission
    }
  }
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Change Role</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Accessibility: Add Description */}
        <AlertDialogDescription className="text-left">
          Select a new role for the member and confirm to save the changes.
        </AlertDialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root className="mb-0">
            {/* Member Name (Static) */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="memberName" required>
                Member Name
              </FormFieldSet.Label>
              <Input id="memberName" value={member.display_name} disabled className="cursor-not-allowed" />
            </FormFieldSet.ControlGroup>

            {/* Select Role (Integrated with react-hook-form) */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="role" required>
                Role
              </FormFieldSet.Label>
              <Select
                {...register('role', { required: 'Please select a role' })}
                value={newMemberRoleValue}
                onValueChange={value => setValue('role', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contributor">Contributor</SelectItem>
                  <SelectItem value="Reader">Reader</SelectItem>
                  <SelectItem value="Executor">Executor</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.role.message}</FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* Footer */}
            <Spacer size={5} />
            <FormFieldSet.ControlGroup>
              <AlertDialogFooter>
                <ButtonGroup.Root>
                  {!submitted ? (
                    <>
                      <AlertDialogCancel onClick={onClose} disabled={!isValid || isSubmitting} className="mt-0">
                        Cancel
                      </AlertDialogCancel>
                      <Button type="submit" theme="primary" disabled={!isValid || isSubmitting || !dirtyFields.role}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      type="button"
                      size="sm"
                      theme="success"
                      className="pointer-events-none flex h-9 gap-2"
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
