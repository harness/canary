import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  IconV2,
  Label,
  Layout,
  Radio,
  SkeletonForm,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { AccessLevel, ErrorTypes, errorTypes, generalSettingsFormSchema, RepoData, RepoUpdateData } from '@/views'
import { BranchSelectorContainerProps } from '@/views/repo/components'
import { zodResolver } from '@hookform/resolvers/zod'

export const RepoSettingsGeneralForm: FC<{
  repoData: RepoData
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isRepoUpdateSuccess: boolean
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
}> = ({
  handleRepoUpdate,
  apiError,
  isLoadingRepoData,
  isUpdatingRepoData,
  isRepoUpdateSuccess,
  branchSelectorRenderer,
  repoData
}) => {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const BranchSelector = branchSelectorRenderer

  const formMethods = useForm<RepoUpdateData>({
    resolver: zodResolver(generalSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch,
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    }
  })

  const { register, handleSubmit, setValue, watch, reset } = formMethods

  useEffect(() => {
    reset({
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch,
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    })
  }, [repoData, isLoadingRepoData, reset])

  const branchValue = watch('branch')

  useEffect(() => {
    let timeoutId: number

    if (isSubmitted && isRepoUpdateSuccess) {
      timeoutId = window.setTimeout(() => setIsSubmitted(false), 1000)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isSubmitted, isRepoUpdateSuccess])

  const handleSelectChange = (fieldName: keyof RepoUpdateData, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<RepoUpdateData> = data => {
    setIsSubmitted(true)
    handleRepoUpdate(data)
  }

  return (
    <Fieldset>
      {isLoadingRepoData ? (
        <SkeletonForm />
      ) : (
        <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <Fieldset>
            <FormInput.Text
              id="name"
              {...register('name')}
              placeholder={t('views:repos.repoNamePlaceholder', 'Enter repository name')}
              disabled
              label={t('views:repos.name', 'Name')}
            />
          </Fieldset>

          {/* DESCRIPTION */}
          <Fieldset>
            <FormInput.Textarea
              id="description"
              {...register('description')}
              placeholder={t('views:repos.repoDescriptionPlaceholder', 'Enter a description of this repository...')}
              label={t('views:repos.description', 'Description')}
              optional
              resizable
            />
          </Fieldset>

          {/* BRANCH */}
          <Fieldset className="w-[298px]">
            <ControlGroup>
              <Layout.Vertical gap="xs">
                <Label>{t('views:repos.defaultBranch', 'Default Branch')}</Label>
                <BranchSelector
                  onSelectBranchorTag={value => {
                    handleSelectChange('branch', value.name)
                  }}
                  isBranchOnly={true}
                  dynamicWidth={true}
                  selectedBranch={{ name: branchValue, sha: '' }}
                />
              </Layout.Vertical>
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <FormInput.Radio label={t('views:repos.visibility', 'Visibility')} id="visibility" {...register('access')}>
              <Radio.Item
                id="access-public"
                value="1"
                label={t('views:repos.public', 'Public')}
                caption={t('views:repos.publicDescription', 'Anyone with access to Harness can clone this repo.')}
              />
              <Radio.Item
                id="access-private"
                value="2"
                label={t('views:repos.private', 'Private')}
                caption={t(
                  'views:repos.privateDescription',
                  'You can choose who can see and commit to this repository.'
                )}
              />
            </FormInput.Radio>
          </Fieldset>

          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonLayout horizontalAlign="start">
                {!isSubmitted || !isRepoUpdateSuccess ? (
                  <Button type="submit" disabled={isUpdatingRepoData}>
                    {!isUpdatingRepoData ? t('views:repos.save', 'Save') : t('views:repos.saving', 'Saving...')}
                  </Button>
                ) : (
                  <Button variant="primary" theme="success" type="button" className="pointer-events-none">
                    Saved
                    <IconV2 name="check" size="xs" />
                  </Button>
                )}
              </ButtonLayout>
            </ControlGroup>
          </Fieldset>

          {!!apiError && errorTypes.has(apiError.type) && <Text color="danger">{apiError.message}</Text>}
        </FormWrapper>
      )}
    </Fieldset>
  )
}
