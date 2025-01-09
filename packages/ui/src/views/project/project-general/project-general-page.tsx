import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Icon,
  Input,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ProjectSettingsGeneralPageProps {
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
  setOpenDeleteDialog: () => void
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
type ProjectSettingsGeneralFields = z.infer<typeof projectSettingsSchema>

export const ProjectSettingsGeneralPage = ({
  spaceData,
  onFormSubmit,
  handleDeleteProject,
  isDeleting,
  isUpdating,
  isDeleteSuccess,
  isUpateSuccess,
  updateError,
  deleteError,
  setOpenDeleteDialog
}: ProjectSettingsGeneralPageProps) => {
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
  } = useForm<ProjectSettingsGeneralFields>({
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
  const onSubmit: SubmitHandler<ProjectSettingsGeneralFields> = formData => {
    onFormSubmit(formData)
  }

  useEffect(() => {
    if (isUpateSuccess) {
      setSubmitted(true)
      setIsCancelDisabled(true)

      const timer = setTimeout(() => {
        setSubmitted(false)
      }, 1000)

      reset({
        identifier: spaceData.identifier,
        description: prodescription
      })

      return () => clearTimeout(timer)
    }
  }, [isUpateSuccess])

  useEffect(() => {
    setValue('description', spaceData?.description ?? '')
    setProDescription(spaceData?.description ?? '')
    setIsCancelDisabled(true)
  }, [spaceData?.description, setValue])

  useEffect(() => {
    setValue('identifier', spaceData?.identifier ?? '')
  }, [spaceData?.identifier, setValue])

  const handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setProDescription(newDescription)
    setValue('description', newDescription, { shouldValidate: true, shouldDirty: true })
    setSubmitted(false)
    setIsCancelDisabled(false)
  }

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
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            {/* PROJECT NAME */}
            <ControlGroup>
              <Input
                value={spaceData?.identifier}
                id="identifier"
                {...register('identifier')}
                placeholder="Enter project name"
                label="Project Name"
                error={errors.identifier?.message?.toString()}
                disabled
                //TODO: onChange={handleProjectNameInputChange}
                //wait for the api call to update the project name
              />
            </ControlGroup>

            {/* IDENTIFIER/DESCRIPTION */}
            <ControlGroup>
              <Input
                // value={prodescription}
                id="description"
                {...register('description')}
                placeholder="Enter unique description"
                label="Description"
                onChange={handleDescriptionInputChange}
                error={errors.description?.message?.toString()}
              />

              {/* {updateError && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{updateError}</FormFieldSet.Message>
              )}
              {deleteError && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{deleteError}</FormFieldSet.Message>
              )} */}
            </ControlGroup>

            {/*BUTTON CONTROL: SAVE & CANCEL*/}
            <ControlGroup type="button">
              <ButtonGroup>
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
              </ButtonGroup>
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <FormSeparator />
          </Fieldset>
        </FormWrapper>

        {/* DELETE PROJECT */}
        {/* <FormDialogProjectDelete
          handleDeleteProject={handleDeleteProject}
          isDeleteSuccess={isDeleteSuccess}
          isDeleting={isDeleting}
          deleteError={deleteError}
        /> */}
        <Button size="sm" theme="error" className="self-start mt-7" onClick={setOpenDeleteDialog}>
          Delete project
        </Button>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
