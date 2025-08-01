import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  MultiSelectOption,
  Text
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { IProjectRulesStore, IRepoStore, repoBranchSettingsFormSchema, SandboxLayout } from '@/views'
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
import { combineAndNormalizePrincipalsAndGroups } from './utils'

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
}

export const RepoBranchSettingsRulesPage: FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading,
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
    formState: { errors }
  } = formMethods

  const { rules } = useBranchRulesStore()

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    const formData = { ...data, rules }
    handleRuleUpdate(formData)
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

  useEffect(() => {
    if (isSubmitSuccess) {
      reset()
      clearErrors()
    }
  }, [isSubmitSuccess])

  const apiErrorsValue =
    apiErrors?.principals || apiErrors?.statusChecks || apiErrors?.addRule || apiErrors?.updateRule || null

  return (
    <SandboxLayout.Content className={`max-w-[612px] ml-3 ${projectScope ? 'mx-auto' : ''}`}>
      <Text as="h1" variant="heading-section" className="mb-4">
        {presetRuleData
          ? t('views:repos.updateBranchRule', 'Update branch rule')
          : t('views:repos.CreateRule', 'Create a branch rule')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
        <FormSeparator />

        <BranchSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />

        <BranchSettingsRuleDescriptionField register={register} errors={errors} />

        <div className="flex flex-col gap-y-10">
          <BranchSettingsRuleTargetPatternsField
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
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
            defaultReviewersOptions={principals?.filter(principal => principal.type === 'user')}
            setPrincipalsSearchQuery={setPrincipalsSearchQuery}
            principalsSearchQuery={principalsSearchQuery}
            recentStatusChecks={recentStatusChecks}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmenuChange={handleSubmenuChange}
            handleSelectChangeForRule={handleSelectChangeForRule}
            handleInputChange={handleInputChange}
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
              <Button type="button" variant="outline" asChild>
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
