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
  Option,
  RadioButton,
  RadioGroup,
  SkeletonList,
  Text,
  Textarea
} from '@/components'
import {
  AccessLevel,
  BranchSelectorListItem,
  ErrorTypes,
  errorTypes,
  generalSettingsFormSchema,
  IBranchSelectorStore,
  RepoData,
  RepoUpdateData,
  TranslationStore
} from '@/views'
import { BranchSelector, BranchSelectorTab } from '@/views/repo/components'
import { zodResolver } from '@hookform/resolvers/zod'

export const RepoSettingsGeneralForm: FC<{
  repoData: RepoData
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isRepoUpdateSuccess: boolean
  selectBranchOrTag: (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  searchQuery: string
  setSearchQuery: (query: string) => void
}> = ({
  repoData,
  handleRepoUpdate,
  apiError,
  isLoadingRepoData,
  isUpdatingRepoData,
  isRepoUpdateSuccess,
  selectBranchOrTag,
  useRepoBranchesStore,
  useTranslationStore,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RepoUpdateData>({
    resolver: zodResolver(generalSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch || '',
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    }
  })

  useEffect(() => {
    reset({
      name: repoData.name || '',
      description: repoData.description || '',
      branch: repoData.defaultBranch || '',
      access: repoData.isPublic ? AccessLevel.PUBLIC : AccessLevel.PRIVATE
    })
  }, [repoData, isLoadingRepoData, reset])

  const accessValue = watch('access')

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
        <SkeletonList />
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
              <Label className="mb-2.5" color="secondary">
                {t('views:repos.defaultBranch', 'Default Branch')}
              </Label>
              <BranchSelector
                useTranslationStore={useTranslationStore}
                useRepoBranchesStore={useRepoBranchesStore}
                onSelectBranch={value => {
                  handleSelectChange('branch', value.name)
                  selectBranchOrTag(value, BranchSelectorTab.BRANCHES)
                }}
                isBranchOnly={true}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </ControlGroup>
          </Fieldset>

          <Fieldset className="mt-4">
            <ControlGroup>
              <Label className="mb-6" color="secondary">
                {t('views:repos.visibility', 'Visibility')}
              </Label>
              <RadioGroup value={accessValue} onValueChange={handleAccessChange} id="visibility">
                <Option
                  control={<RadioButton value="1" id="access-public" />}
                  id="access-public"
                  label={t('views:repos.public', 'Public')}
                  ariaSelected={accessValue === '1'}
                  description={t(
                    'views:repos.publicDescription',
                    'Anyone with access to the gitness environment can clone this repo.'
                  )}
                />
                <Option
                  control={<RadioButton value="2" id="access-private" />}
                  id="access-private"
                  label={t('views:repos.private', 'Private')}
                  ariaSelected={accessValue === '2'}
                  description={t(
                    'views:repos.privateDescription',
                    'You can choose who can see and commit to this repository.'
                  )}
                />
              </RadioGroup>
              {errors.access && <Message theme={MessageTheme.ERROR}>{errors.access.message?.toString()}</Message>}
            </ControlGroup>
          </Fieldset>

          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                {!isSubmitted || !isRepoUpdateSuccess ? (
                  <Button type="submit" disabled={!isValid || isUpdatingRepoData}>
                    {!isUpdatingRepoData ? t('views:repos.save', 'Save') : t('views:repos.saving', 'Saving...')}
                  </Button>
                ) : (
                  <Button variant="ghost" type="button" theme="success" className="pointer-events-none">
                    Saved&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup>
            </ControlGroup>
          </Fieldset>

          {!!apiError && errorTypes.has(apiError.type) && (
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          )}
        </FormWrapper>
      )}
    </Fieldset>
  )
}
