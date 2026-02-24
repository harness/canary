import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonLayout, FormSeparator, FormWrapper, Layout, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { IProjectRulesStore, IRepoStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@utils/cn'

import { TargetRepoSelectorForPushRules } from '../components/target-repo-selector/target-repo-selector'
import { combineAndNormalizePrincipalsAndGroups, RepoQueryObject } from '../utils'
import {
  PushSettingsRuleBypassListField,
  PushSettingsRuleDescriptionField,
  PushSettingsRuleListField,
  PushSettingsRuleNameField,
  PushSettingsRuleToggleField
} from './components/repo-push-rules-fields'
import { IPushRulesStore, repoPushRuleSettingsFormSchema, RepoPushRulesSettingsFormFields } from './types'

type PushSettingsErrors = {
  principals: string | null
  statusChecks?: string | null
  addRule: string | null
  updateRule: string | null
}

interface RepoPushSettingsRulesPageProps {
  isLoading?: boolean
  repoQueryObj?: RepoQueryObject
  handleRuleUpdate: (data: RepoPushRulesSettingsFormFields) => void
  apiErrors?: PushSettingsErrors
  useRepoRulesStore: () => IRepoStore | IProjectRulesStore
  usePushRulesStore: () => IPushRulesStore
  handleCheckboxChange: (id: string, checked: boolean) => void
  handleInputChange: (id: string, value: string) => void
  handleInitialRules: (presetRuleData: RepoPushRulesSettingsFormFields | null) => void
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
  isSubmitSuccess?: boolean
  projectScope?: boolean
  bypassListPlaceholder?: string
}

export const RepoPushSettingsRulesPage: FC<RepoPushSettingsRulesPageProps> = ({
  isLoading,
  repoQueryObj,
  handleRuleUpdate,
  useRepoRulesStore,
  apiErrors,
  usePushRulesStore,
  handleCheckboxChange,
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
  const { presetRuleData, principals, userGroups } = useRepoRulesStore()
  const formMethods = useForm<RepoPushRulesSettingsFormFields>({
    resolver: zodResolver(repoPushRuleSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pattern: '',
      state: true,
      repo_owners: false,
      patterns: [],
      repoPattern: '',
      repoPatterns: [],
      targetRepos: [],
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
    formState: { errors }
  } = formMethods

  const { rules } = usePushRulesStore()

  const onSubmit: SubmitHandler<RepoPushRulesSettingsFormFields> = data => {
    const formData = { ...data, rules }
    handleRuleUpdate(formData)
  }

  useEffect(() => {
    if (presetRuleData) {
      reset({
        identifier: presetRuleData?.identifier || '',
        description: presetRuleData?.description || '',
        pattern: '',
        state: presetRuleData?.state && true,
        repo_owners: presetRuleData?.repo_owners || false,
        patterns: presetRuleData?.patterns || [],
        repoPattern: presetRuleData?.repoPattern || '',
        repoPatterns: presetRuleData?.repoPatterns || [],
        targetRepos: presetRuleData?.targetRepos || [],
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
          ? t('views:repos.updatePushRule', 'Update push rule')
          : t('views:repos.createPushRule', 'Create push rule')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <PushSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
        <FormSeparator />

        <PushSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />

        <PushSettingsRuleDescriptionField register={register} errors={errors} />

        <Layout.Vertical gapY="3xl">
          {projectScope && (
            <TargetRepoSelectorForPushRules
              watch={watch}
              setValue={setValue}
              errors={errors}
              repoQueryObj={repoQueryObj}
            />
          )}
          {/* TODO: add target patterns field after BE supports it*/}
          {/* <PushSettingsRuleTargetPatternsField setValue={setValue} watch={watch} register={register} errors={errors} /> */}
          <PushSettingsRuleBypassListField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            bypassOptions={combineAndNormalizePrincipalsAndGroups(principals, userGroups)}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
            bypassListPlaceholder={bypassListPlaceholder}
          />
          <PushSettingsRuleListField
            rules={rules}
            ruleIdentifier={presetRuleData?.identifier}
            handleCheckboxChange={handleCheckboxChange}
            handleInputChange={handleInputChange}
          />
        </Layout.Vertical>

        {!!apiErrorsValue && <Text color="danger">{apiErrorsValue}</Text>}

        <ButtonLayout horizontalAlign="start">
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
