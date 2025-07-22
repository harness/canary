import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonLayout, ControlGroup, Fieldset, FormWrapper, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { IProjectRulesStore, IRepoStore, SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'

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
  projectScope = false
}) => {
  const { NavLink } = useRouterContext()
  const { t } = useTranslation()
  const { presetRuleData, principals, recentStatusChecks } = useRepoRulesStore()
  const formMethods = useForm<RepoTagSettingsFormFields>({
    resolver: zodResolver(repoTagSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pattern: '',
      state: true,
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
    <SandboxLayout.Content className={`max-w-[570px] px-0 ${projectScope ? 'mx-auto' : ''}`}>
      <Text as="h1" variant="heading-section" color="foreground-1" className="mb-10">
        {presetRuleData
          ? t('views:repos.updateTagRule', 'Update tag rule')
          : t('views:repos.CreateTagRule', 'Create a tag rule')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <TagSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />

        <TagSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />

        <TagSettingsRuleDescriptionField register={register} errors={errors} />

        <div className="flex flex-col gap-y-11">
          <TagSettingsRuleTargetPatternsField watch={watch} setValue={setValue} register={register} errors={errors} />

          <TagSettingsRuleBypassListField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            bypassOptions={principals}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
          />

          <TagSettingsRuleListField
            rules={rules}
            // recentStatusChecks={recentStatusChecks}
            handleCheckboxChange={handleCheckboxChange}
            // handleSubmenuChange={handleSubmenuChange}
            // handleSelectChangeForRule={handleSelectChangeForRule}
            // handleInputChange={handleInputChange}
          />
        </div>
        <Fieldset className="mt-5">
          <ControlGroup>
            <ButtonLayout horizontalAlign="start">
              <Button type="submit" disabled={isLoading}>
                {!isLoading
                  ? presetRuleData
                    ? t('views:repos.updateRule', 'Update rule')
                    : t('views:repos.createRuleButton', 'Create rule')
                  : presetRuleData
                    ? t('views:repos.updatingRule', 'Updating rule...')
                    : t('views:repos.creatingRuleButton', 'Creating rule...')}
              </Button>
              <Button type="button" variant="outline">
                <NavLink to="..">{t('views:repos.cancel', 'Cancel')}</NavLink>
              </Button>
            </ButtonLayout>
          </ControlGroup>
        </Fieldset>

        {!!apiErrorsValue && <span className="text-2 text-cn-foreground-danger">{apiErrorsValue}</span>}
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
