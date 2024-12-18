import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { Button, ButtonGroup, ControlGroup, Fieldset, Spacer, Text } from '@/components'
import { IRepoStore, SandboxLayout } from '@/views'

import {
  BranchSettingsRuleBypassListField,
  BranchSettingsRuleDefaultBranchField,
  BranchSettingsRuleDescriptionField,
  BranchSettingsRuleEditPermissionsField,
  BranchSettingsRuleListField,
  BranchSettingsRuleNameField,
  BranchSettingsRuleTargetPatternsField,
  BranchSettingsRuleToggleField
} from './components/repo-branch-rules-fields'
import { BypassUsersList, IBranchRulesStore, RepoBranchSettingsFormFields } from './types'

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
  handleCheckboxChange: (id: string, checked: boolean) => void
  handleSubmenuChange: (id: string, subOptionId: string, checked: boolean) => void
  handleSelectChangeForRule: (id: string, selectedOption: string) => void
  handleInputChange: (id: string, input: string) => void
  handleInitialRules: (presetRuleData: RepoBranchSettingsFormFields | null) => void
}

export const RepoBranchSettingsRulesPage: React.FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading,
  handleRuleUpdate,
  useRepoRulesStore,
  apiErrors,
  useBranchRulesStore,
  handleCheckboxChange,
  handleSubmenuChange,
  handleSelectChangeForRule,
  handleInputChange,
  handleInitialRules
}) => {
  const { presetRuleData, principals, recentStatusChecks } = useRepoRulesStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RepoBranchSettingsFormFields>({
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
      reset({
        identifier: '',
        description: '',
        pattern: '',
        patterns: [],
        state: true,
        default: false,
        repo_owners: false,
        bypass: [],
        rules: []
      })
      handleInitialRules(null)
    }
  }, [presetRuleData])
  return (
    <>
      <SandboxLayout.Content maxWidth="2xl" className="ml-0">
        {presetRuleData ? (
          <Text size={5} weight="medium" as="div" className="mb-8">
            Update rule
          </Text>
        ) : (
          <Text size={5} weight="medium" as="div" className="mb-8">
            Create a rule
          </Text>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
            <BranchSettingsRuleNameField register={register} errors={errors} disabled={!!presetRuleData} />
            <BranchSettingsRuleDescriptionField register={register} errors={errors} />
            <BranchSettingsRuleTargetPatternsField
              watch={watch}
              setValue={setValue}
              register={register}
              errors={errors}
            />
            <BranchSettingsRuleDefaultBranchField
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
            <BranchSettingsRuleBypassListField
              setValue={setValue}
              watch={watch}
              bypassOptions={principals as BypassUsersList[]}
            />
            <BranchSettingsRuleEditPermissionsField
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
            <BranchSettingsRuleListField
              rules={rules}
              recentStatusChecks={recentStatusChecks}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmenuChange={handleSubmenuChange}
              handleSelectChangeForRule={handleSelectChangeForRule}
              handleInputChange={handleInputChange}
            />

            {apiErrors &&
              (apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule || apiErrors.updateRule) && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule}
                  </Text>
                </>
              )}

            <Fieldset className="mt-0">
              <ControlGroup>
                <ButtonGroup>
                  {!presetRuleData ? (
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                        {!isLoading ? 'Create rule' : 'Creating rule...'}
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <NavLink to="../general">Cancel</NavLink>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                        {!isLoading ? 'Update rule' : 'Updating rule...'}
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <NavLink to="../general">Cancel</NavLink>
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </ControlGroup>
            </Fieldset>
          </Fieldset>
        </form>
      </SandboxLayout.Content>
    </>
  )
}
