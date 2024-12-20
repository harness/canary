import { useEffect, useState } from 'react'
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
  Spacer,
  Text,
  Textarea
} from '@/components'
import { BranchSelectorListItem, IBranchSelectorStore, TranslationStore } from '@/views'
import { BranchSelector, BranchSelectorTab } from '@/views/repo/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AccessLevel, ErrorTypes, RepoData, RepoUpdateData } from '../types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  branch: z.string(),
  access: z.enum([AccessLevel.PUBLIC, AccessLevel.PRIVATE], {})
})
export type RepoUpdateFormFields = z.infer<typeof formSchema>

export const RepoSettingsGeneralForm: React.FC<{
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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RepoUpdateFormFields>({
    resolver: zodResolver(formSchema),
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
  }, [repoData, isLoadingRepoData])

  const accessValue = watch('access')

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (isSubmitted && isRepoUpdateSuccess) {
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1000)
    }
  }, [isSubmitted, isRepoUpdateSuccess])

  const handleSelectChange = (fieldName: keyof RepoUpdateFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleAccessChange = (value: AccessLevel) => {
    setValue('access', value, { shouldValidate: true })
  }
  const onSubmit: SubmitHandler<RepoUpdateFormFields> = data => {
    setIsSubmitted(true)
    handleRepoUpdate(data)
  }
  const errorTypes = new Set([
    ErrorTypes.FETCH_REPO,
    ErrorTypes.FETCH_BRANCH,
    ErrorTypes.DESCRIPTION_UPDATE,
    ErrorTypes.BRANCH_UPDATE,
    ErrorTypes.UPDATE_ACCESS
  ])

  if (isLoadingRepoData) {
    return <SkeletonList />
  }

  return (
    <>
      <Text size={5} weight="medium" className="mb-2">
        {t('views:repos.generalSettings', 'General settings')}
      </Text>
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
        <Fieldset className="w-[298px] gap-y-0">
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
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Text className="leading-none text-foreground-2" size={2}>
              {t('views:repos.visibility', 'Visibility')}
            </Text>
            <RadioGroup className="mt-6" value={accessValue} onValueChange={handleAccessChange} id="access">
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

        {apiError && errorTypes.has(apiError.type) && (
          <>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {apiError.message}
            </Text>
          </>
        )}

        {/* SUBMIT BUTTONS */}
        <Fieldset>
          <ControlGroup>
            <ButtonGroup>
              {!isSubmitted || !isRepoUpdateSuccess ? (
                <>
                  <Button type="submit" size="sm" disabled={!isValid || isUpdatingRepoData}>
                    {!isUpdatingRepoData ? t('views:repos.save', 'Save') : t('views:repos.saving', 'Saving...')}
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
      </FormWrapper>
    </>
  )
}
