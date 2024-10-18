import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  Select,
  Button,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Input
} from '@harnessio/canary'
import { FormFieldSet } from '../../'

interface FormEditDialogProps {
  member: { display_name: string; role: string }
  onSave: (newRole: string) => void
  onClose: () => void
}

export const FormEditDialog: React.FC<FormEditDialogProps> = ({ member, onSave, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(member.role)

  const handleSave = () => {
    onSave(selectedRole)
  }

  return (
    <form>
      <FormFieldSet.Root box shaded>
        <FormFieldSet.ControlGroup>
          <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Role</AlertDialogTitle>
              </AlertDialogHeader>

              {/* Member Display Name */}

              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="memberName" required>
                  Member Name
                </FormFieldSet.Label>
                <Input value={member.display_name} disabled className="cursor-not-allowed" />
                {/* {errors.memberName && (
                  <FormFieldSet.Message theme={MessageTheme.ERROR}>
                    {errors.memberName.message?.toString()}
                  </FormFieldSet.Message>
                )} */}
              </FormFieldSet.ControlGroup>

              {/* Select Role */}
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="role" required>
                  Role
                </FormFieldSet.Label>
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldSet.ControlGroup>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                <Button onClick={handleSave} size="sm" theme="primary">
                  Save
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </FormFieldSet.ControlGroup>
      </FormFieldSet.Root>
    </form>
  )
}
