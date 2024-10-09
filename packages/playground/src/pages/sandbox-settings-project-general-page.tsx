import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  ButtonGroup,
  Input,
  Spacer,
  Text,
  Icon,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@harnessio/canary'
import { SandboxLayout, FormFieldSet } from '..'
import { MessageTheme } from '../components/form-field-set'

interface PageProps {
  onFormSubmit: (data: InputProps) => void
}
interface InputProps {
  projectName: string
  identifier: string
  projectURL: string
}

// Define form schema for Project Settings
const projectSettingsSchema = z.object({
  projectName: z.string().min(1, { message: 'Please provide a company name' }),
  identifier: z.string().min(1, { message: 'Please provide an identifier' }),
  projectURL: z.string().url({ message: 'Please provide a valid URL' }),
  verification: z.string().min(1, { message: 'Please type the DELETE to verify' })
})

// Define TypeScript type
type ProjectSettingsFields = z.infer<typeof projectSettingsSchema>

function SandboxSettingsProjectGeneralPage({ onFormSubmit }: PageProps) {
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    reset: resetProjectSettingsForm,
    formState: { errors, isValid, dirtyFields },
    watch
  } = useForm<ProjectSettingsFields>({
    resolver: zodResolver(projectSettingsSchema),
    mode: 'onChange',
    defaultValues: {
      projectName: 'Acme Inc.',
      identifier: 'FOA',
      projectURL: 'https://acme.com'
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false) // State for successful deletion
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State to control alert dialog

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsFields> = data => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Project settings updated:', data)
      setIsSubmitting(false)
      setSubmitted(true)
      resetProjectSettingsForm(data) // Reset to the current values
      setTimeout(() => setSubmitted(false), 2000)
    }, 2000)
    onFormSubmit(data)
  }

  // Watch the verification value
  const verificationValue = watch('verification')

  const typeCheck = (value: string) => {
    return value === 'DELETE'
  }

  // Delete project handler
  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setDeleteSuccess(true) // Mark deletion as successful
      setTimeout(() => {
        setIsDialogOpen(false) // Close the dialog
        window.location.href = '/' // Redirect to home page
      }, 2000) // Redirect after 2 seconds
    }, 2000)
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Project Settings
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root>
            {/* COMPANY LOGO */}
            <FormFieldSet.ControlGroup className="w-auto flex flex-row gap-x-6 items-center justify-start">
              <Avatar size="80" className="h-20 w-20 rounded-full bg-primary/[0.02] shadow-md">
                <AvatarImage src="/images/company-logo.jpg" />
                <AvatarFallback>
                  <Text size={5} weight="medium" color="tertiaryBackground">
                    A
                  </Text>
                </AvatarFallback>
              </Avatar>
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="companyLogo">Company logo</FormFieldSet.Label>
                <ButtonGroup.Root spacing="3">
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="trash" size={14} />
                  </Button>
                </ButtonGroup.Root>
              </FormFieldSet.ControlGroup>
            </FormFieldSet.ControlGroup>

            {/* PROJECT NAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="projectName" required>
                Project Name
              </FormFieldSet.Label>
              <Input id="projectName" {...register('projectName')} placeholder="Enter project name" />
              {errors.projectName && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.projectName.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* IDENTIFIER */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="identifier" required>
                Identifier
              </FormFieldSet.Label>
              <Input id="identifier" {...register('identifier')} placeholder="Enter unique identifier" />
              {errors.identifier && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.identifier.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* PROJECT URL */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="projectURL" required>
                Project URL
              </FormFieldSet.Label>
              <Input id="projectURL" {...register('projectURL')} placeholder="https://your-project-url.com" />
              {errors.projectURL && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.projectURL.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* SAVE CHANGES AND CANCEL BUTTONS */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!submitted ? (
                  <>
                    <Button
                      size="sm"
                      type="submit"
                      disabled={!isValid || isSubmitting || !Object.keys(dirtyFields).length}>
                      {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                    <Button size="sm" variant="outline" type="button" onClick={() => resetProjectSettingsForm()}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Saved&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>

        <FormFieldSet.Root>
          <FormFieldSet.Separator />
        </FormFieldSet.Root>

        {/* DELETE PROJECT SETTINGS WITH ALERT DIALOG */}
        <FormFieldSet.Root box shaded>
          <FormFieldSet.Legend>Delete project</FormFieldSet.Legend>
          <FormFieldSet.SubLegend>
            This will permanently delete this project and all associated data. All repositories in it will also be
            deleted. This action cannot be undone.
          </FormFieldSet.SubLegend>
          <FormFieldSet.ControlGroup>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" theme="error" className="self-start" onClick={() => setIsDialogOpen(true)}>
                  Delete project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
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
                  {errors.projectName && (
                    <FormFieldSet.Message theme={MessageTheme.ERROR}>
                      {errors.projectName.message?.toString()}
                    </FormFieldSet.Message>
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  {!isDeleting && !deleteSuccess && (
                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                  )}
                  {deleteSuccess ? (
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
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsProjectGeneralPage }
