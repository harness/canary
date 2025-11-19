import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { IProjectRulesStore, IRepoStore, repoBranchSettingsFormSchema } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Button,
  ButtonLayout,
  FormSeparator,
  FormWrapper,
  Layout,
  MultiSelectOption,
  Text
} from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import { TargetRepoSelectorForBranch } from '../components/target-repo-selector/target-repo-selector'
import { areRulesValid, combineAndNormalizePrincipalsAndGroups, RepoQueryObject } from '../utils'
import {
  BranchSettingsRuleBypassListField,
  BranchSettingsRuleDescriptionField,
  BranchSettingsRuleListField,
  BranchSettingsRuleNameField,
  BranchSettingsRuleTargetPatternsField,
  BranchSettingsRuleToggleField
} from './components/repo-branch-rules-fields'
import { EnumBypassListType, IBranchRulesStore, PatternsButtonType, RepoBranchSettingsFormFields } from './types'

type BranchSettingsErrors = {
  principals: string | null
  statusChecks?: string | null
  addRule: string | null
  updateRule: string | null
}

interface RepoBranchSettingsRulesPageProps {
  isLoading?: boolean
  handleRuleUpdate: (data: RepoBranchSettingsFormFields) => void
  apiErrors?: BranchSettingsErrors
  useRepoRulesStore: () => IRepoStore | IProjectRulesStore
  useBranchRulesStore: () => IBranchRulesStore
  handleCheckboxChange: (id: string, checked: boolean) => void
  handleSubmenuChange: (id: string, subOptionId: string, checked: boolean) => void
  handleSelectChangeForRule: (id: string, selectedOptions: MultiSelectOption[]) => void
  handleInputChange: (id: string, input: string) => void
  handleInitialRules: (presetRuleData: RepoBranchSettingsFormFields | null) => void
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
  isSubmitSuccess?: boolean
  projectScope?: boolean
  bypassListPlaceholder?: string
  repoQueryObj?: RepoQueryObject
}

export const RepoBranchSettingsRulesPage: FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading,
  repoQueryObj,
  handleRuleUpdate,
  useRepoRulesStore,
  apiErrors,
  useBranchRulesStore,
  handleCheckboxChange,
  handleSubmenuChange,
  handleSelectChangeForRule,
  handleInputChange,
  handleInitialRules,
  setPrincipalsSearchQuery,
  principalsSearchQuery,
  isSubmitSuccess,
  projectScope = false,
  bypassListPlaceholder
}) => {
  const { NavLink } = useRouterContext()
  const { t } = useTranslation()
  const { presetRuleData, principals, userGroups, recentStatusChecks } = useRepoRulesStore()
  const formMethods = useForm<RepoBranchSettingsFormFields>({
    resolver: zodResolver(repoBranchSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pattern: '',
      patterns: [],
      repoPattern: '',
      repoPatterns: [],
      targetRepos: [],
      state: true,
      default: false,
      repo_owners: false,
      bypass: [],
      rules: []
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors }
  } = formMethods

  const { rules } = useBranchRulesStore()

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    if (!areRulesValid(rules)) {
      return
    }

    const formData = { ...data, rules }
    handleRuleUpdate(formData)
  }

  const pattern = watch('pattern')
  const patterns = watch('patterns') || []

  const handleAddPattern = (option: PatternsButtonType) => {
    if (patterns.some(p => p.pattern === pattern)) {
      setError('pattern', { message: 'Pattern already exists' })
    } else if (pattern) {
      setValue('patterns', [...patterns, { pattern, option }])
      setValue('pattern', '')
    }
  }

  const handleRemovePattern = (patternVal: string) => {
    const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
    setValue('patterns', updatedPatterns)
  }

  useEffect(() => {
    if (presetRuleData) {
      reset({
        identifier: presetRuleData?.identifier || '',
        description: presetRuleData?.description || '',
        pattern: '',
        patterns: presetRuleData?.patterns || [],
        repoPattern: presetRuleData?.repoPattern || '',
        repoPatterns: presetRuleData?.repoPatterns || [],
        targetRepos: presetRuleData?.targetRepos || [],
        state: presetRuleData?.state && true,
        default: presetRuleData?.default || false,
        repo_owners: presetRuleData?.repo_owners || false,
        bypass: presetRuleData?.bypass || [],
        rules: []
      })
      handleInitialRules(presetRuleData)
    } else {
      reset()
      handleInitialRules(null)
    }
  }, [handleInitialRules, presetRuleData, reset])

  useEffect(() => {
    if (isSubmitSuccess) {
      reset()
      clearErrors()
    }
  }, [isSubmitSuccess])

  const apiErrorsValue =
    apiErrors?.principals || apiErrors?.statusChecks || apiErrors?.addRule || apiErrors?.updateRule || null

  return (
    <Layout.Vertical className={cn('settings-form-width', { 'mx-auto': projectScope })} gapY="md">
      <Text as="h1" variant="heading-section">
        {presetRuleData
          ? t('views:repos.updateBranchRule', 'Update branch rule')
          : t('views:repos.createBranchRule', 'Create a branch rule')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
        <FormSeparator />

        <BranchSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />

        <BranchSettingsRuleDescriptionField register={register} errors={errors} />

        <Layout.Vertical gapY="3xl">
          {projectScope && (
            <TargetRepoSelectorForBranch
              watch={watch}
              setValue={setValue}
              errors={errors}
              repoQueryObj={repoQueryObj}
            />
          )}
          <BranchSettingsRuleTargetPatternsField
            handleAdd={handleAddPattern}
            handleRemove={handleRemovePattern}
            patterns={patterns}
            errors={errors}
            register={register}
          />

          <BranchSettingsRuleBypassListField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            bypassOptions={combineAndNormalizePrincipalsAndGroups(principals, userGroups)}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
            bypassListPlaceholder={bypassListPlaceholder}
          />

          <BranchSettingsRuleListField
            rules={rules}
            defaultReviewersOptions={combineAndNormalizePrincipalsAndGroups(
              principals?.filter(principal => principal.type === EnumBypassListType.USER) || [],
              userGroups
            )}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
            recentStatusChecks={recentStatusChecks}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmenuChange={handleSubmenuChange}
            handleSelectChangeForRule={handleSelectChangeForRule}
            handleInputChange={handleInputChange}
          />
        </Layout.Vertical>

        {!!apiErrorsValue && <Text color="danger">{apiErrorsValue}</Text>}

        <ButtonLayout horizontalAlign="start" className="mt-cn-md">
          <Button type="submit" disabled={isLoading}>
            {!isLoading
              ? presetRuleData
                ? t('views:repos.updateRuleButton', 'Update Rule')
                : t('views:repos.createRuleButton', 'Create Rule')
              : presetRuleData
                ? t('views:repos.updatingRuleButton', 'Updating Rule...')
                : t('views:repos.creatingRuleButton', 'Creating Rule...')}
          </Button>
          <Button type="button" variant="outline" asChild>
            <NavLink to="..">{t('views:repos.cancel', 'Cancel')}</NavLink>
          </Button>
        </ButtonLayout>
      </FormWrapper>
    </Layout.Vertical>
  )
}
