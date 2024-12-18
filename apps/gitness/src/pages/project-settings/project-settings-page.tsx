import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup, Icon, Input, Spacer, Text } from '@harnessio/canary'
import { FormFieldSet, SandboxLayout } from '@harnessio/views'

import { FormDialogProjectDelete } from './components/form-dialog-project-delete'

interface PageProps {
  spaceData: InputProps
  onFormSubmit: (formData: InputProps) => void
  onHandleDescription: (newDescription: string) => void
  handleDeleteProject: () => void
  isDeleteSuccess: boolean
  isDeleting: boolean
  isUpdating: boolean
  isUpateSuccess: boolean
  updateError: string | null
  deleteError: string | null
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

export const ProjectSettingsPage = ({
  spaceData,
  onFormSubmit,
  handleDeleteProject,
  isDeleting,
  isUpdating,
  isDeleteSuccess,
  isUpateSuccess,
  updateError,
  deleteError
}: PageProps) => {
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    // TODO: will use this to reset the form after api call has projectName
    // reset: resetProjectSettingsForm,
    reset,
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

  const [submitted, setSubmitted] = useState(false)
  const [prodescription, setProDescription] = useState(spaceData?.description)
  const [isCancelDisabled, setIsCancelDisabled] = useState(true)

  const isSaveButtonDisabled = submitted || !isValid || !isDirty || isUpdating

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsFields> = formData => {
    onFormSubmit(formData)
  }

  useEffect(() => {
    if (isUpateSuccess) {
      setSubmitted(true)
      setIsCancelDisabled(true)

      // After 1 second, reset the submitted state and make the button clickable again
      const timer = setTimeout(() => {
        setSubmitted(false)
      }, 1000) // Reset after 1 seconds

      reset({
        // Reset form to current values, so the button stays clickable if user makes changes
        identifier: spaceData.identifier,
        description: prodescription
      })

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpateSuccess])

  useEffect(() => {
    setValue('description', spaceData?.description ?? '')
    setProDescription(spaceData?.description ?? '')
    setIsCancelDisabled(true)
  }, [spaceData?.description, setValue])

  useEffect(() => {
    setValue('identifier', spaceData?.identifier ?? '') // Ensure identifier is set even when disabled
  }, [spaceData?.identifier, setValue])

  const handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setProDescription(newDescription)
    setValue('description', newDescription, { shouldValidate: true, shouldDirty: true })
    setSubmitted(false)
    setIsCancelDisabled(false)
  }

  // temporary solution: Reset only the description field on cancel excluding the project name
  const handleCancel = () => {
    resetField('description', { defaultValue: spaceData.description })
    setProDescription(spaceData?.description ?? '')
    setIsCancelDisabled(true)
  }

  return (
    <SandboxLayout.Main>
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
                //TODO: onChange={handleProjectNameInputChange}
                //wait for the api call to update the project name
              />
              {errors.identifier && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
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
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {errors.description.message?.toString()}
                </FormFieldSet.Message>
              )}
              {updateError && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{updateError}</FormFieldSet.Message>
              )}
              {deleteError && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{deleteError}</FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/*BUTTON CONTROL: SAVE & CANCEL*/}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!submitted ? (
                  <>
                    <Button
                      size="sm"
                      type="submit"
                      disabled={isSaveButtonDisabled}
                      className={`${
                        isUpdating
                          ? 'cursor-wait'
                          : isSaveButtonDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : 'Save changes'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      disabled={isCancelDisabled}
                    >
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
          deleteError={deleteError}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
