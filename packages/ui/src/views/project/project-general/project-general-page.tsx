import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Legend,
  Separator,
  SkeletonForm,
  Textarea
} from '@/components'
import {
  makeProjectDescriptionSchema,
  makeProjectNameSchema,
  SandboxLayout,
  TranslationStore,
  TypesSpace
} from '@/views'
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
  useTranslationStore: () => TranslationStore
}

const makeProjectSettingsSchema = (t: TranslationStore['t']) =>
  z.object({ identifier: makeProjectNameSchema(t), description: makeProjectDescriptionSchema(t) })

export type ProjectSettingsGeneralFields = z.infer<ReturnType<typeof makeProjectSettingsSchema>>

export const ProjectSettingsGeneralPage = ({
  data,
  isLoading = false,
  onFormSubmit,
  isUpdating,
  isUpdateSuccess,
  updateError,
  setOpenDeleteDialog,
  useTranslationStore
}: ProjectSettingsGeneralPageProps) => {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectSettingsGeneralFields>({
    resolver: zodResolver(makeProjectSettingsSchema(t)),
    mode: 'onSubmit',
    defaultValues: {
      identifier: data?.identifier ?? '',
      description: data?.description ?? ''
    }
  })

  const [submitted, setSubmitted] = useState(false)

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
    reset({ identifier: data?.identifier ?? '', description: data?.description ?? '' })
  }, [data, reset])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto max-w-[38.125rem] pt-[3.25rem]">
        <h2 className="text-foreground-1 mb-10 text-2xl font-medium">
          {t('views:projectSettings.general.mainTitle', 'Project Settings')}
        </h2>

        {isLoading && <SkeletonForm />}

        {!isLoading && (
          <>
            <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
              <Fieldset legend="Project details">
                <Input
                  id="identifier"
                  {...register('identifier')}
                  placeholder={t('views:projectSettings.general.projectNamePlaceholder', 'Enter project name')}
                  label={t('views:projectSettings.general.projectNameLabel', 'Project name')}
                  error={errors.identifier?.message?.toString()}
                  // TODO: backend is not ready to update project name
                  disabled
                />

                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder={t(
                    'views:projectSettings.general.projectDescriptionPlaceholder',
                    'Enter description (optional)'
                  )}
                  label={t('views:projectSettings.general.projectDescriptionLabel', 'Description')}
                  error={errors?.description?.message?.toString()}
                />

                {updateError && (
                  <Alert.Container variant="destructive">
                    <Alert.Title>{updateError}</Alert.Title>
                  </Alert.Container>
                )}

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
              </Fieldset>
            </FormWrapper>

            <Separator className="mt-8" />

            <Legend
              className="mt-7 max-w-[28.5rem]"
              title={t('views:projectSettings.general.deleteProjectTitle', 'Delete project')}
              description={t(
                'views:projectSettings.general.deleteProjectDescription',
                'This will permanently delete this project, and everything contained in it. All repositories in it will also be deleted.'
              )}
            >
              <Button theme="error" variant="destructive" className="mt-3.5 w-fit" onClick={setOpenDeleteDialog}>
                {t('views:projectSettings.general.deleteProjectButton', 'Delete project')}
              </Button>
            </Legend>
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
