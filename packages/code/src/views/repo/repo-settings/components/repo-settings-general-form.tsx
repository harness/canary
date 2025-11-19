import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { AccessLevel, ErrorTypes, errorTypes, generalSettingsFormSchema, RepoData, RepoUpdateData } from '@/views'
import { BranchSelectorContainerProps } from '@/views/repo/components'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Button,
  ButtonLayout,
  ControlGroup,
  FormInput,
  FormWrapper,
  IconV2,
  Label,
  Radio,
  Skeleton,
  Text
} from '@harnessio/ui/components'
import { useCustomDialogTrigger, useTranslation } from '@harnessio/ui/context'

export const RepoSettingsGeneralForm: FC<{
  repoData: RepoData
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isRepoUpdateSuccess: boolean
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps & React.RefAttributes<HTMLButtonElement>>
  setCreateBranchDialogOpen: (open: boolean) => void
  onBranchQueryChange: (query: string) => void
}> = ({
  handleRepoUpdate,
  apiError,
  isLoadingRepoData,
  isUpdatingRepoData,
  isRepoUpdateSuccess,
  branchSelectorRenderer,
  repoData,
  setCreateBranchDialogOpen,
  onBranchQueryChange
}) => {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const BranchSelector = branchSelectorRenderer

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const toggleCreateBranchDialogOpen = (open: boolean) => {
    registerTrigger()
    setCreateBranchDialogOpen(open)
  }

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty }
  } = formMethods

  useEffect(() => {
    // Don't reset the form during updates to prevent UI flakiness
    // Only reset when not updating and when repoData changes
    if (!isUpdatingRepoData) {
      reset({
        name: repoData.name || '',
        description: repoData.description || '',
        branch: repoData.defaultBranch,
        access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
      })
    }
  }, [repoData, reset, isUpdatingRepoData])

  // Reset form after successful update to ensure we have the latest data from server
  useEffect(() => {
    if (isRepoUpdateSuccess && !isUpdatingRepoData) {
      reset({
        name: repoData.name || '',
        description: repoData.description || '',
        branch: repoData.defaultBranch,
        access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
      })
    }
  }, [isRepoUpdateSuccess, isUpdatingRepoData, repoData, reset])

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
    if (!isDirty && branchValue === repoData.defaultBranch) return

    setIsSubmitted(true)
    handleRepoUpdate(data)
  }

  if (isLoadingRepoData) {
    return <Skeleton.Form />
  }

  return (
    <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
      <FormInput.Text
        id="name"
        {...register('name')}
        placeholder={t('views:repos.repoNamePlaceholder', 'Enter repository name')}
        disabled
        label={t('views:repos.name', 'Name')}
      />

      <FormInput.Textarea
        id="description"
        {...register('description')}
        placeholder={t('views:repos.repoDescriptionPlaceholder', 'Enter a description of this repository...')}
        label={t('views:repos.description', 'Description')}
        optional
        resizable
        rows={6}
      />

      <ControlGroup>
        <Label>{t('views:repos.defaultBranch', 'Default Branch')}</Label>
        <BranchSelector
          ref={triggerRef}
          onSelectBranchorTag={value => {
            handleSelectChange('branch', value.name)
          }}
          isBranchOnly
          selectedBranch={{ name: branchValue, sha: '' }}
          isUpdating={isUpdatingRepoData}
          disabled={isUpdatingRepoData}
          setCreateBranchDialogOpen={toggleCreateBranchDialogOpen}
          onBranchQueryChange={onBranchQueryChange}
          className="w-fit max-w-full"
        />
      </ControlGroup>

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
          caption={t('views:repos.privateDescription', 'You can choose who can see and commit to this repository.')}
        />
      </FormInput.Radio>

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

      {!!apiError && errorTypes.has(apiError.type) && <Text color="danger">{apiError.message}</Text>}
    </FormWrapper>
  )
}
