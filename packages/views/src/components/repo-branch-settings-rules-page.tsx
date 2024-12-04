import { useEffect, useReducer } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

import { Button, ButtonGroup, Spacer, Text, useZodForm } from '@harnessio/canary'

import { FormFieldSet } from '../index'
import { branchSettingsReducer } from './repo-settings/repo-branch-settings-rules/reducers/repo-branch-settings-reducer'
import { branchRules } from './repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-data'
import {
  BranchSettingsRuleBypassListField,
  BranchSettingsRuleDefaultBranchField,
  BranchSettingsRuleDescriptionField,
  BranchSettingsRuleEditPermissionsField,
  BranchSettingsRuleListField,
  BranchSettingsRuleNameField,
  BranchSettingsRuleTargetPatternsField,
  BranchSettingsRuleToggleField
} from './repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-fields'
import { repoBranchSettingsFormSchema } from './repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-schema'
import {
  BranchRulesActionType,
  BypassUsersList,
  MergeStrategy,
  RepoBranchSettingsFormFields
} from './repo-settings/repo-branch-settings-rules/types'

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
      selectOptions: [],
      input: ''
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
        type: BranchRulesActionType.SET_INITIAL_RULES,
        payload: preSetRuleData?.rules?.map(rule => ({
          id: rule.id,
          checked: rule.checked || false,
          submenu: (rule.submenu || []) as MergeStrategy[],
          selectOptions: rule.selectOptions || [],
          input: rule.input || ''
        }))
      })
    }
  }, [preSetRuleData])
  return (
    <>
      <Text size={5} weight="medium" as="div" className="mb-8">
        Create a rule
      </Text>
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
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
