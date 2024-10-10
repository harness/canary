import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Input, Spacer, Text, Icon } from '@harnessio/canary'
import { SandboxLayout, FormFieldSet, MessageTheme } from '@harnessio/playground'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialogProjectDelete } from './components/FormDialogProjectDelete'

interface PageProps {
  spaceData: InputProps
  onFormSubmit: (formData: InputProps) => void
  onHandleDescription: (newDescription: string) => void
  handleDeleteProject: () => void
  isDeleteSuccess: boolean
  isDeleting: boolean
}
interface InputProps {
  identifier: string
  description: string
}

// Define form schema for Project Settings
const projectSettingsSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a project name' }),
  description: z.string().min(1, { message: 'Please provide an description' })
})

// Define TypeScript type
type ProjectSettingsFields = z.infer<typeof projectSettingsSchema>

export const ProjectSettingsSandboxPage = ({
  onFormSubmit,
  spaceData,
  handleDeleteProject,
  isDeleteSuccess,
  isDeleting
}: PageProps) => {
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    // reset: resetProjectSettingsForm, // will use this to reset the form after api call has projectName
    resetField,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<ProjectSettingsFields>({
    resolver: zodResolver(projectSettingsSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: spaceData?.identifier, //project name
      description: spaceData?.description
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [prodescription, setProDescription] = useState(spaceData?.description)
  const [isCancelDisabled, setIsCancelDisabled] = useState(true)

  const isSaveButtonDisabled = !isValid || isSubmitting || !isDirty

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsFields> = formData => {
    setIsSubmitting(true)

    setTimeout(() => {
      console.log('Project settings updated:', formData)
      setIsSubmitting(false)
      setSubmitted(true)
      // resetProjectSettingsForm(formData) // TODO:will use this to reset the form after api call has projectName
      setTimeout(() => setSubmitted(false), 2000)
    }, 2000)

    onFormSubmit(formData)
  }

  useEffect(() => {
    setValue('description', spaceData?.description ?? '') // Sync description from parent
    setProDescription(spaceData?.description ?? '') // Update local state as well
    setIsCancelDisabled(true)
  }, [spaceData?.description, setValue])

  // Manually set the identifier if it's disabled
  useEffect(() => {
    setValue('identifier', spaceData?.identifier ?? '') // Ensure identifier is set even when disabled
  }, [spaceData?.identifier, setValue])

  const handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setProDescription(newDescription)
    setValue('description', newDescription, { shouldValidate: true, shouldDirty: true }) // Update form state
    setIsCancelDisabled(false)
  }

  // Reset only the description field on cancel
  const handleCancel = () => {
    resetField('description', { defaultValue: spaceData.description })
    setProDescription(spaceData?.description ?? '')
    setIsCancelDisabled(true)
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
            {/* PROJECT NAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="identifier" required>
                Project Name
              </FormFieldSet.Label>
              <Input
                value={spaceData?.identifier}
                id="identifier"
                {...register('identifier')}
                placeholder="Enter project name"
                disabled
                // onChange={handleProjectNameInputChange}
              />
              {errors.identifier && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.identifier.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* IDENTIFIER/DESCRIPTION */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="description" required>
                Description
              </FormFieldSet.Label>
              <Input
                value={prodescription}
                id="description"
                {...register('description')}
                placeholder="Enter unique description"
                onChange={handleDescriptionInputChange}
              />
              {errors.description && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.description.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/*BUTTON CONTROL: SAVE & CANCEL*/}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!submitted ? (
                  <>
                    <Button size="sm" type="submit" disabled={isSaveButtonDisabled}>
                      {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      disabled={isCancelDisabled}>
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

        {/* DELETE PROJECT */}
        <FormDialogProjectDelete
          handleDeleteProject={handleDeleteProject}
          isDeleteSuccess={isDeleteSuccess}
          isDeleting={isDeleting}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
