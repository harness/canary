import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  Select,
  Button,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Input,
  Spacer,
  Icon,
  ButtonGroup
} from '@harnessio/canary'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormFieldSet, MessageTheme } from '..'

interface FormEditDialogProps {
  member: { display_name: string; role: string }
  onSave: (newRole: string) => void
  onClose: () => void
}

export const FormEditDialog: React.FC<FormEditDialogProps> = ({ member, onSave, onClose }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form submit handler
  const onSubmit: SubmitHandler<MemberFields> = data => {
    console.log('Submitting new member:', data)
    setIsSubmitting(true)
    setTimeout(() => {
      onSave(data.role) // Pass the new role on save
      console.log('New member updated:', data)
      setIsSubmitting(false)
      setSubmitted(true)
      resetNewMemberForm(data) // Reset to the current values
      setTimeout(() => setSubmitted(false), 2000)
    }, 2000)
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Role</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Accessibility: Add Description */}
        <AlertDialogDescription>
          Select a new role for the member and confirm to save the changes.
        </AlertDialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root className="mb-0">
            {/* Member Name (Static) */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="memberName" required>
                Member Name
              </FormFieldSet.Label>
              <Input value={member.display_name} disabled className="cursor-not-allowed" />
            </FormFieldSet.ControlGroup>

            {/* Select Role (Integrated with react-hook-form) */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="role" required>
                Role
              </FormFieldSet.Label>
              <Select
                {...register('role', { required: 'Please select a role' })}
                value={newMemberRoleValue}
                onValueChange={value => setValue('role', value, { shouldValidate: true, shouldDirty: true })}>
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
                      <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                      <Button type="submit" theme="primary" disabled={!isValid || isSubmitting || !dirtyFields.role}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                      Saved&nbsp;&nbsp;
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
