import React, { useReducer, useEffect } from 'react'
import { Button, ButtonGroup, useZodForm, Spacer, Text } from '@harnessio/canary'
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
  BypassUsersList,
  ActionType,
  MergeStrategy
} from '../components/repo-settings/repo-branch-settings-rules/types'

type BranchSettingsErrors = {
  principals: string | null
  statusChecks: string | null
  addRule: string | null
  updateRule: string | null
}

interface RepoBranchSettingsRulesPageProps {
  isLoading?: boolean
  handleRuleUpdate: (data: RepoBranchSettingsFormFields) => void
  principals?: BypassUsersList[]
  recentStatusChecks?: string[]
  apiErrors?: BranchSettingsErrors
  preSetRuleData?: RepoBranchSettingsFormFields | null
}

export const RepoBranchSettingsRulesPage: React.FC<RepoBranchSettingsRulesPageProps> = ({
  isLoading,
  handleRuleUpdate,
  principals,
  recentStatusChecks,
  apiErrors,
  preSetRuleData
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

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    const formData = { ...data, rules }
    handleRuleUpdate(formData)
    reset()
  }

  useEffect(() => {
    if (preSetRuleData) {
      reset({
        identifier: preSetRuleData?.identifier || '',
        description: preSetRuleData?.description || '',
        pattern: '',
        patterns: preSetRuleData?.patterns || [],
        state: preSetRuleData?.state && true,
        default: preSetRuleData?.default || false,
        repo_owners: preSetRuleData?.repo_owners || false,
        bypass: preSetRuleData?.bypass || [],
        rules: []
      })

      dispatch({
        type: ActionType.SET_INITIAL_RULES,
        payload: preSetRuleData?.rules?.map(rule => ({
          id: rule.id,
          checked: rule.checked || false,
          submenu: (rule.submenu || []) as MergeStrategy[],
          selectOptions: rule.selectOptions || []
        }))
      })
    }
  }, [preSetRuleData])
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSet.Root>
          <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
          <BranchSettingsRuleNameField register={register} errors={errors} disabled={!!preSetRuleData} />
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

          {apiErrors &&
            (apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule || apiErrors.updateRule) && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule}
                </Text>
              </>
            )}

          <FormFieldSet.Root className="mt-0">
            <FormFieldSet.ControlGroup>
              <ButtonGroup.Root>
                {!preSetRuleData ? (
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Create rule' : 'Creating rule...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Update rule' : 'Updating rule...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      Cancel
                    </Button>
                  </>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
