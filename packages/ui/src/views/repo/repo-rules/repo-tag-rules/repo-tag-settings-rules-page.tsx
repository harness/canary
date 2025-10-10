import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonLayout, FormSeparator, FormWrapper, Layout, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { IProjectRulesStore, IRepoStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@utils/cn'

import { combineAndNormalizePrincipalsAndGroups } from '../../utils'
import {
  TagSettingsRuleBypassListField,
  TagSettingsRuleDescriptionField,
  TagSettingsRuleListField,
  TagSettingsRuleNameField,
  TagSettingsRuleTargetPatternsField,
  TagSettingsRuleToggleField
} from './components/repo-tag-rules-fields'
import { ITagRulesStore, RepoTagSettingsFormFields, repoTagSettingsFormSchema } from './types'

type TagSettingsErrors = {
  principals: string | null
  statusChecks?: string | null
  addRule: string | null
  updateRule: string | null
}

interface RepoTagSettingsRulesPageProps {
  isLoading?: boolean
  handleRuleUpdate: (data: RepoTagSettingsFormFields) => void
  apiErrors?: TagSettingsErrors
  useRepoRulesStore: () => IRepoStore | IProjectRulesStore
  useTagRulesStore: () => ITagRulesStore
  handleCheckboxChange: (id: string, checked: boolean) => void
  handleInitialRules: (presetRuleData: RepoTagSettingsFormFields | null) => void
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
  isSubmitSuccess?: boolean
  projectScope?: boolean
  bypassListPlaceholder?: string
}

export const RepoTagSettingsRulesPage: FC<RepoTagSettingsRulesPageProps> = ({
  isLoading,
  handleRuleUpdate,
  useRepoRulesStore,
  apiErrors,
  useTagRulesStore,
  handleCheckboxChange,
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
  const formMethods = useForm<RepoTagSettingsFormFields>({
    resolver: zodResolver(repoTagSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pattern: '',
      state: true,
      repo_owners: false,
      patterns: [],
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

  const { rules } = useTagRulesStore()

  const onSubmit: SubmitHandler<RepoTagSettingsFormFields> = data => {
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
          ? t('views:repos.updateTagRule', 'Update tag rule')
          : t('views:repos.createTagRule', 'Create tag rule')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <TagSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
        <FormSeparator />

        <TagSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />

        <TagSettingsRuleDescriptionField register={register} errors={errors} />

        <Layout.Vertical gapY="3xl">
          <TagSettingsRuleTargetPatternsField watch={watch} setValue={setValue} register={register} errors={errors} />

          <TagSettingsRuleBypassListField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            bypassOptions={combineAndNormalizePrincipalsAndGroups(principals, userGroups)}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
            bypassListPlaceholder={bypassListPlaceholder}
          />

          <TagSettingsRuleListField rules={rules} handleCheckboxChange={handleCheckboxChange} />
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
