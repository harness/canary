import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormInput,
  FormSeparator,
  FormWrapper,
  Icon,
  Legend,
  SkeletonForm
} from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout, TypesSpace } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ProjectSettingsGeneralPageProps {
  data?: TypesSpace
  isLoading?: boolean
  onFormSubmit: (formData: ProjectSettingsGeneralFields) => void
  isUpdating: boolean
  isUpdateSuccess: boolean
  updateError: string | null
  setOpenDeleteDialog: () => void
}

const projectSettingsSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a project name' }),
  description: z.string()
})

export type ProjectSettingsGeneralFields = z.infer<typeof projectSettingsSchema>

export const ProjectSettingsGeneralPage = ({
  data,
  isLoading = false,
  onFormSubmit,
  isUpdating,
  isUpdateSuccess,
  updateError,
  setOpenDeleteDialog
}: ProjectSettingsGeneralPageProps) => {
  const { t } = useTranslation()
  const formMethods = useForm<ProjectSettingsGeneralFields>({
    resolver: zodResolver(projectSettingsSchema),
    mode: 'onSubmit',
    defaultValues: {
      identifier: data?.identifier ?? '', //project name
      description: data?.description ?? ''
    }
  })

  const { register, handleSubmit, reset, setValue } = formMethods

  const [submitted, setSubmitted] = useState(false)

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectSettingsGeneralFields> = formData => {
    onFormSubmit(formData)
  }

  const handleReset = () => reset()

  useEffect(() => {
    if (isUpdateSuccess) {
      setSubmitted(true)

      const timer = setTimeout(() => {
        setSubmitted(false)
      }, 1000)

      reset({
        identifier: data?.identifier ?? '',
        description: data?.description ?? ''
      })

      return () => clearTimeout(timer)
    }
  }, [isUpdateSuccess, reset, data?.description, data?.identifier])

  useEffect(() => {
    setValue('description', data?.description ?? '')
  }, [data?.description, setValue])

  useEffect(() => {
    setValue('identifier', data?.identifier ?? '')
  }, [data?.identifier, setValue])

  useEffect(() => {
    reset({
      identifier: data?.identifier ?? '',
      description: data?.description ?? ''
    })
  }, [data, reset])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto max-w-[38.125rem] pt-[3.25rem]">
        <h2 className="mb-10 text-2xl font-medium text-cn-foreground-1">
          {t('views:projectSettings.general.mainTitle', 'Project Settings')}
        </h2>

        {isLoading && <SkeletonForm />}

        {!isLoading && (
          <>
            <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
              <Fieldset>
                {/* PROJECT NAME */}
                <FormInput.Text
                  id="identifier"
                  {...register('identifier')}
                  placeholder={t('views:projectSettings.general.projectNamePlaceholder', 'Enter project name')}
                  label={t('views:projectSettings.general.projectNameLabel', 'Project name')}
                  // TODO: backend is not ready to update project name
                  disabled
                />

                {/* IDENTIFIER/DESCRIPTION */}
                <FormInput.Textarea
                  id="description"
                  {...register('description')}
                  placeholder={t('views:projectSettings.general.projectDescriptionPlaceholder', 'Enter description')}
                  optional
                  label={t('views:projectSettings.general.projectDescriptionLabel', 'Description')}
                />

                {updateError && (
                  <Alert.Root theme="danger">
                    <Alert.Title>{updateError}</Alert.Title>
                  </Alert.Root>
                )}

                {/*BUTTON CONTROL: SAVE & CANCEL*/}
                <ControlGroup type="button">
                  <ButtonGroup spacing="3">
                    {!submitted ? (
                      <>
                        <Button type="submit">
                          {isUpdating
                            ? t('views:projectSettings.general.formSubmitButton.savingState', 'Saving...')
                            : t('views:projectSettings.general.formSubmitButton.defaultState', 'Save changes')}
                        </Button>
                        <Button variant="outline" type="button" onClick={handleReset}>
                          {t('views:projectSettings.general.formCancelButton', 'Cancel')}
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" type="button" theme="success" className="pointer-events-none">
                        {t('views:projectSettings.general.formSubmitButton.savedState', 'Saved')}&nbsp;&nbsp;
                        <Icon name="tick" size={14} />
                      </Button>
                    )}
                  </ButtonGroup>
                </ControlGroup>
              </Fieldset>
            </FormWrapper>

            <FormSeparator className="mt-8" />

            <Legend
              className="mt-7 max-w-[27.5rem]"
              title={t('views:projectSettings.general.deleteProjectTitle', 'Delete project')}
              description={t(
                'views:projectSettings.general.deleteProjectDescription',
                'This will permanently delete this project, and everything contained in it. All repositories in it will also be deleted.'
              )}
            >
              <Button theme="danger" variant="secondary" className="mt-3.5 w-fit" onClick={setOpenDeleteDialog}>
                {t('views:projectSettings.general.deleteProjectButton', 'Delete project')}
              </Button>
            </Legend>
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
