import React, { useState, useReducer } from 'react'
import { Button, ButtonGroup, Icon, useZodForm } from '@harnessio/canary'
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
import {
  RepoBranchSettingsFormFields,
  repoBranchSettingsFormSchema
} from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-schema'
import { mockBypassUserData } from './mocks/repo-branch-settings/mockBypassUserData'

export const RepoBranchSettingsRulesPage: React.FC<{ isLoading?: boolean; handleRuleUpdate; principals }> = ({
  isLoading = false,
  handleRuleUpdate,
  principals
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
      selectOptions: ''
    }))
  )

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    setIsSubmitted(true)
    const formData = { ...data, rules }
    console.log(formData)
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
            bypassOptions={principals || mockBypassUserData}
          />
          <BranchSettingsRuleEditPermissionsField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <BranchSettingsRuleListField rules={rules} dispatch={dispatch} />

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

// || mockBypassUserData
