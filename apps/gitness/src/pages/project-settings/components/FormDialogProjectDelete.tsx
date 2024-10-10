import { useState } from 'react'
import {
  Button,
  Input,
  Icon,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@harnessio/canary'
import { FormFieldSet, MessageTheme } from '@harnessio/playground'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const projectDeleteSchema = z.object({
  verification: z.string().min(1, { message: 'Please type the DELETE to verify' })
})

type ProjectDeleteFields = z.infer<typeof projectDeleteSchema>

interface FormProjDeleteProps {
  handleDeleteProject: () => void
  isDeleteSuccess: boolean
  isDeleting: boolean
}
//delete project form with dialog
export const FormDialogProjectDelete = ({ handleDeleteProject, isDeleteSuccess, isDeleting }: FormProjDeleteProps) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm<ProjectDeleteFields>({
    resolver: zodResolver(projectDeleteSchema)
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const verificationValue = watch('verification')

  const typeCheck = (value: string) => {
    return value === 'DELETE'
  }

  const handleDelete = () => {
    handleDeleteProject()
    if (isDeleteSuccess) {
      setTimeout(() => {
        setIsDialogOpen(false) // Close the dialog
      }, 2000) // Redirect after 2 seconds
    }
  }

  return (
    <FormFieldSet.Root box shaded>
      <FormFieldSet.Legend>Delete project</FormFieldSet.Legend>
      <FormFieldSet.SubLegend>
        This will permanently delete this project and all associated data. All repositories in it will also be deleted.
        This action cannot be undone.
      </FormFieldSet.SubLegend>
      <FormFieldSet.ControlGroup>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button size="sm" theme="error" className="self-start" onClick={() => setIsDialogOpen(true)}>
              Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your project and remove all data. All repositories in this project will
                also be deleted. This action cannot be undone.
              </AlertDialogDescription>
              {/* input delete verification */}
              <FormFieldSet.Label htmlFor="verification" required>
                To confirm this, type “DELETE”
              </FormFieldSet.Label>
              <Input id="verification" {...register('verification')} placeholder="" />
              {errors.verification && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.verification.message?.toString()}
                </FormFieldSet.Message>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              {!isDeleting && !isDeleteSuccess && (
                <AlertDialogCancel className="mt-0" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
              )}
              {isDeleteSuccess ? (
                <Button size="default" theme="success" className="self-start pointer-events-none">
                  Project deleted&nbsp;&nbsp;
                  <Icon name="tick" size={14} />
                </Button>
              ) : (
                <Button
                  size="default"
                  theme="error"
                  className="self-start"
                  onClick={handleDelete}
                  disabled={!typeCheck(verificationValue) || isDeleting}>
                  {isDeleting ? 'Deleting project...' : 'Yes, delete project'}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </FormFieldSet.ControlGroup>
    </FormFieldSet.Root>
  )
}
