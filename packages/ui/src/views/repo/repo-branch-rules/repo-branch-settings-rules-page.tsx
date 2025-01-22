import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper } from '@/components'
import { IRepoStore, repoBranchSettingsFormSchema, SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  BranchSettingsRuleBypassListField,
  BranchSettingsRuleDescriptionField,
  BranchSettingsRuleListField,
  BranchSettingsRuleNameField,
  BranchSettingsRuleTargetPatternsField,
  BranchSettingsRuleToggleField
} from './components/repo-branch-rules-fields'
import { IBranchRulesStore, RepoBranchSettingsFormFields } from './types'

type BranchSettingsErrors = {
  principals: string | null
  statusChecks: string | null
  addRule: string | null
  updateRule: string | null
}

interface RepoBranchSettingsRulesPageProps {
  isLoading?: boolean
  handleRuleUpdate: (data: RepoBranchSettingsFormFields) => void
  apiErrors?: BranchSettingsErrors
  useRepoRulesStore: () => IRepoStore
  useBranchRulesStore: () => IBranchRulesStore
  useTranslationStore: () => TranslationStore
  handleCheckboxChange: (id: string, checked: boolean) => void
  handleSubmenuChange: (id: string, subOptionId: string, checked: boolean) => void
  handleSelectChangeForRule: (id: string, selectedOption: string) => void
  handleInputChange: (id: string, input: string) => void
  handleInitialRules: (presetRuleData: RepoBranchSettingsFormFields | null) => void
  setPrincipalsSearchQuery: (val: string) => void
  principalsSearchQuery: string
}

export const RepoBranchSettingsRulesPage: FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading,
  handleRuleUpdate,
  useRepoRulesStore,
  useTranslationStore,
  apiErrors,
  useBranchRulesStore,
  handleCheckboxChange,
  handleSubmenuChange,
  handleSelectChangeForRule,
  handleInputChange,
  handleInitialRules,
  setPrincipalsSearchQuery,
  principalsSearchQuery
}) => {
  const { t } = useTranslationStore()
  const { presetRuleData, principals, recentStatusChecks } = useRepoRulesStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RepoBranchSettingsFormFields>({
    resolver: zodResolver(repoBranchSettingsFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pattern: '',
      patterns: [],
      state: true,
      default: false,
      repo_owners: false,
      bypass: [],
      rules: []
    }
  })

  const { rules } = useBranchRulesStore()

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    const formData = { ...data, rules }
    handleRuleUpdate(formData)
    reset()
  }

  useEffect(() => {
    if (presetRuleData) {
      reset({
        identifier: presetRuleData?.identifier || '',
        description: presetRuleData?.description || '',
        pattern: '',
        patterns: presetRuleData?.patterns || [],
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

  const apiErrorsValue =
    apiErrors?.principals || apiErrors?.statusChecks || apiErrors?.addRule || apiErrors?.updateRule || null

  return (
    <SandboxLayout.Content className="max-w-[570px] px-0">
      <h1 className="mb-10 text-2xl font-medium text-foreground-1">
        {presetRuleData ? t('views:repos.updateRule', 'Update rule') : t('views:repos.CreateRule', 'Create a rule')}
      </h1>

      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} t={t} />

        <BranchSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} t={t} />

        <BranchSettingsRuleDescriptionField register={register} errors={errors} t={t} />

        <div className="flex flex-col gap-y-11">
          <BranchSettingsRuleTargetPatternsField
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
            t={t}
          />

          <BranchSettingsRuleBypassListField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            bypassOptions={principals}
            t={t}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
          />

          <BranchSettingsRuleListField
            rules={rules}
            recentStatusChecks={recentStatusChecks}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmenuChange={handleSubmenuChange}
            handleSelectChangeForRule={handleSelectChangeForRule}
            handleInputChange={handleInputChange}
            t={t}
          />
        </div>
        <Fieldset className="mt-5">
          <ControlGroup>
            <ButtonGroup>
              <Button type="submit" disabled={!isValid || isLoading}>
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
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>

        {!!apiErrorsValue && <span className="text-xs text-destructive">{apiErrorsValue}</span>}
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
