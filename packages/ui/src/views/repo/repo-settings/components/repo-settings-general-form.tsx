import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Label,
  Message,
  MessageTheme,
  Radio,
  SkeletonForm,
  Text,
  Textarea
} from '@/components'
import {
  AccessLevel,
  ErrorTypes,
  errorTypes,
  generalSettingsFormSchema,
  RepoData,
  RepoUpdateData,
  TranslationStore
} from '@/views'
import { BranchSelectorContainerProps } from '@/views/repo/components'
import { zodResolver } from '@hookform/resolvers/zod'

export const RepoSettingsGeneralForm: FC<{
  repoData: RepoData
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isRepoUpdateSuccess: boolean
  useTranslationStore: () => TranslationStore
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
}> = ({
  handleRepoUpdate,
  apiError,
  isLoadingRepoData,
  isUpdatingRepoData,
  isRepoUpdateSuccess,
  useTranslationStore,
  branchSelectorRenderer,
  repoData
}) => {
  const { t } = useTranslationStore()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const BranchSelector = branchSelectorRenderer

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<RepoUpdateData>({
    resolver: zodResolver(generalSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch,
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    }
  })

  useEffect(() => {
    reset({
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch,
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    })
  }, [repoData, isLoadingRepoData, reset])

  const accessValue = watch('access')
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

  const handleAccessChange = (value: AccessLevel) => {
    setValue('access', value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<RepoUpdateData> = data => {
    setIsSubmitted(true)
    handleRepoUpdate(data)
  }

  return (
    <Fieldset>
      <Text size={13} weight="medium">
        {t('views:repos.generalSettings', 'General settings')}
      </Text>
      {isLoadingRepoData ? (
        <SkeletonForm />
      ) : (
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <Fieldset>
            <ControlGroup>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('views:repos.repoNamePlaceholder', 'Enter repository name')}
                disabled
                label={t('views:repos.name', 'Name')}
                size="md"
                autoFocus
                error={errors.name?.message?.toString()}
              />
            </ControlGroup>
            {/* DESCRIPTION */}
            <ControlGroup>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('views:repos.repoDescriptionPlaceholder', 'Enter a description of this repository...')}
                label={t('views:repos.description', 'Description')}
                error={errors.description?.message?.toString()}
                optional
              />
            </ControlGroup>
          </Fieldset>

          {/* BRANCH */}
          <Fieldset className="w-[298px]">
            <ControlGroup>
              <Label className="mb-2">{t('views:repos.defaultBranch', 'Default Branch')}</Label>
              <BranchSelector
                onSelectBranchorTag={value => {
                  handleSelectChange('branch', value.name)
                }}
                isBranchOnly={true}
                dynamicWidth={true}
                selectedBranch={{ name: branchValue, sha: '' }}
              />
            </ControlGroup>
          </Fieldset>

          <Fieldset className="mt-4">
            <ControlGroup>
              <Label className="mb-6">{t('views:repos.visibility', 'Visibility')}</Label>
              <Radio.Root value={accessValue} onValueChange={handleAccessChange} id="visibility">
                <Radio.Item
                  id="access-public"
                  value="1"
                  label={t('views:repos.public', 'Public')}
                  caption={t(
                    'views:repos.publicDescription',
                    'Anyone with access to the gitness environment can clone this repo.'
                  )}
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
              </Radio.Root>
              {errors.access && <Message theme={MessageTheme.ERROR}>{errors.access.message?.toString()}</Message>}
            </ControlGroup>
          </Fieldset>

          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                {!isSubmitted || !isRepoUpdateSuccess ? (
                  <Button type="submit" disabled={isUpdatingRepoData}>
                    {!isUpdatingRepoData ? t('views:repos.save', 'Save') : t('views:repos.saving', 'Saving...')}
                  </Button>
                ) : (
                  <Button variant="primary" theme="success" type="button" className="pointer-events-none">
                    Saved
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup>
            </ControlGroup>
          </Fieldset>

          {!!apiError && errorTypes.has(apiError.type) && (
            <Text size={1} className="text-cn-foreground-danger">
              {apiError.message}
            </Text>
          )}
        </FormWrapper>
      )}
    </Fieldset>
  )
}
