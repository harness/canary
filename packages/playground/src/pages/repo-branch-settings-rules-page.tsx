import React, { useState, useReducer } from 'react'
import { Button, ButtonGroup, Icon, useZodForm, Spacer, Text } from '@harnessio/canary'
import { SubmitHandler } from 'react-hook-form'
import {
  BranchSettingsRuleToggleField,
  BranchSettingsRuleNameField,
  BranchSettingsRuleDescriptionField,
  BranchSettingsRuleTargetPatternsField,
  BranchSettingsRuleDefaultBranchField,
  BranchSettingsRuleBypassListField,
  BranchSettingsRuleEditPermissionsField,
  BranchSettingsRuleListField
} from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-fields'
import { branchSettingsReducer } from '../components/repo-settings/repo-branch-settings-rules/reducers/repo-branch-settings-reducer'
import { FormFieldSet } from '../index'
import { branchRules } from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-data'
import { repoBranchSettingsFormSchema } from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-schema'
import {
  RepoBranchSettingsFormFields,
  BypassUsersList
} from '../components/repo-settings/repo-branch-settings-rules/types'

type BranchSettingsErrors = {
  principals: string | null
  statusChecks: string | null
  addRule: string | null
}

interface RepoBranchSettingsRulesPageProps {
  isLoading?: boolean
  handleRuleUpdate: (data: RepoBranchSettingsFormFields) => void
  principals?: BypassUsersList[]
  recentStatusChecks?: string[]
  apiErrors?: BranchSettingsErrors
}

export const RepoBranchSettingsRulesPage: React.FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading = false,
  handleRuleUpdate,
  principals,
  recentStatusChecks,
  apiErrors
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useZodForm({
    schema: repoBranchSettingsFormSchema,
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
      access: '1',
      rules: []
    }
  })
  const [rules, dispatch] = useReducer(
    branchSettingsReducer,
    branchRules.map(rule => ({
      id: rule.id,
      checked: false,
      submenu: [],
      selectOptions: []
    }))
  )

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    setIsSubmitted(true)
    const formData = { ...data, rules }
    handleRuleUpdate(formData)
    reset()
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSet.Root>
          <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
          <BranchSettingsRuleNameField register={register} errors={errors} />
          <BranchSettingsRuleDescriptionField register={register} errors={errors} />
          <BranchSettingsRuleTargetPatternsField
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
          />
          <BranchSettingsRuleDefaultBranchField register={register} errors={errors} setValue={setValue} watch={watch} />
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
          <BranchSettingsRuleListField rules={rules} dispatch={dispatch} recentStatusChecks={recentStatusChecks} />

          {apiErrors && (
            <>
              <Spacer size={2} />
              <Text size={1} className="text-destructive">
                {apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule}
              </Text>
            </>
          )}

          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              <ButtonGroup.Root>
                {!isSubmitted ? (
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Create rule' : 'Creating rule...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Rule created&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
