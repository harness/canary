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
  Message,
  MessageTheme,
  Spacer,
  Text
} from '@/components'
import { ISpaceStore, SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ProjectSettingsGeneralPageProps {
  onFormSubmit: (formData: InputProps) => void
  isUpdating: boolean
  isUpdateSuccess: boolean
  updateError: string | null
  useSpaceStore: () => ISpaceStore
  setOpenDeleteDialog: () => void
}
interface InputProps {
  identifier: string
  description: string
}

const projectSettingsSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a project name' }),
  description: z.string()
})

type ProjectSettingsGeneralFields = z.infer<typeof projectSettingsSchema>

export const ProjectSettingsGeneralPage = ({
  useSpaceStore,
  onFormSubmit,
  isUpdating,
  isUpdateSuccess,
  updateError,
  setOpenDeleteDialog
}: ProjectSettingsGeneralPageProps) => {
  // Project Settings form handling
  const { space: spaceData } = useSpaceStore()
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    formState: { errors }
  } = useForm<ProjectSettingsGeneralFields>({
    resolver: zodResolver(projectSettingsSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: spaceData?.identifier, //project name
      description: spaceData?.description
    }
  })

  const [submitted, setSubmitted] = useState(false)

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsGeneralFields> = formData => {
    onFormSubmit(formData)
  }

  useEffect(() => {
    if (isUpdateSuccess) {
      setSubmitted(true)

      const timer = setTimeout(() => {
        setSubmitted(false)
      }, 1000)

      reset({
        identifier: spaceData?.identifier,
        description: spaceData?.description
      })

      return () => clearTimeout(timer)
    }
  }, [isUpdateSuccess, reset, spaceData?.description, spaceData?.identifier])

  useEffect(() => {
    setValue('description', spaceData?.description ?? '')
  }, [spaceData?.description, setValue])

  useEffect(() => {
    setValue('identifier', spaceData?.identifier ?? '')
  }, [spaceData?.identifier, setValue])

  useEffect(() => {
    reset({
      identifier: spaceData?.identifier,
      description: spaceData?.description
    })
  }, [spaceData, reset])

  const handleCancel = () => {
    resetField('description', { defaultValue: spaceData?.description })
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
              />
            </ControlGroup>

            {/* IDENTIFIER/DESCRIPTION */}
            <ControlGroup>
              <Input
                id="description"
                {...register('description')}
                placeholder="Enter description"
                label="Description"
                onChange={e => setValue('description', e.target.value)}
                error={errors.description?.message?.toString()}
              />

              {updateError && <Message theme={MessageTheme.ERROR}>{updateError}</Message>}
            </ControlGroup>

            {/*BUTTON CONTROL: SAVE & CANCEL*/}
            <ControlGroup type="button">
              <ButtonGroup>
                {!submitted ? (
                  <>
                    <Button size="sm" type="submit">
                      {isUpdating ? 'Saving...' : 'Save changes'}
                    </Button>
                    <Button size="sm" variant="outline" type="button" onClick={handleCancel}>
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

        <Button size="sm" theme="error" className="mt-7 self-start" onClick={setOpenDeleteDialog}>
          Delete project
        </Button>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
