import React, { useState } from 'react'
import { Button, ButtonGroup, Input, Spacer, Text, Icon } from '@harnessio/canary'
import { SandboxLayout, FormFieldSet, MessageTheme } from '@harnessio/playground'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProjDelete } from './components/FormProjDelete'

interface PageProps {
  spaceData: InputProps
  onFormSubmit: (formData: InputProps) => void
  onHandleDescription: (newDescription: string) => void
}
interface InputProps {
  identifier: string
  description: string
}

// Define form schema for Project Settings
const projectSettingsSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a project name' }),
  description: z.string().min(1, { message: 'Please provide an description' })
  // projectURL: z.string().url({ message: 'Please provide a valid URL' }),
})

// Define TypeScript type
type ProjectSettingsFields = z.infer<typeof projectSettingsSchema>

export const ProjectSettingsSandboxPage = ({ onFormSubmit, spaceData }: PageProps) => {
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    reset: resetProjectSettingsForm,
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

  const isSaveButtonDisabled = !isValid || isSubmitting || !isDirty

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsFields> = formData => {
    setIsSubmitting(true)

    setTimeout(() => {
      console.log('Project settings updated:', formData)
      setIsSubmitting(false)
      setSubmitted(true)
      resetProjectSettingsForm(formData) // Reset to the current values
      setTimeout(() => setSubmitted(false), 2000)
    }, 2000)

    onFormSubmit(formData)
  }

  const handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setProDescription(newDescription)
    setValue('description', newDescription, { shouldValidate: true, shouldDirty: true }) // Update form state
  }

  // Manually set the identifier if it's disabled
  React.useEffect(() => {
    setValue('identifier', spaceData?.identifier ?? '') // Ensure identifier is set even when disabled
  }, [spaceData?.identifier, setValue])

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

        {/* DELETE PROJECT */}
        <FormProjDelete />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
