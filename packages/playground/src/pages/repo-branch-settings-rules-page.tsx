import React, { useState } from 'react'
import { Button, ButtonGroup, Icon } from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FormFieldSet } from '../index'
import { rules } from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-data'
import {
  RepoBranchSettingsFormFields,
  repoBranchSettingsFormSchema
} from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-schema'

// interface RepoSettingsRulesPageProps {
//   onFormSubmit?: (data: FormFields) => void
//   onFormCancel?: () => void
//   apiError?: string | null
//   isLoading?: boolean
//   isSuccess?: boolean
// }

export const RepoBranchSettingsRulesPage: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
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
      name: '',
      description: '',
      targetPatterns: '',
      toggleValue: true,
      defaultBranchValue: true,
      editPermissionsValue: false,
      bypassValue: '',
      access: '1',
      rules: rules.map(rule => ({ key: rule.id, id: rule.id, checked: false, submenu: [], selectOptions: '' }))
    }
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const onSubmit: SubmitHandler<RepoBranchSettingsFormFields> = data => {
    setIsSubmitted(true)
    console.log(data)
    reset()
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSet.Root>
          <BranchSettingsRuleToggleField register={register} setValue={setValue} watch={watch} />
          <BranchSettingsRuleNameField register={register} errors={errors} />
          <BranchSettingsRuleDescriptionField register={register} errors={errors} />
          <BranchSettingsRuleTargetPatternsField register={register} errors={errors} />
          <BranchSettingsRuleDefaultBranchField register={register} errors={errors} setValue={setValue} watch={watch} />
          <BranchSettingsRuleBypassListField setValue={setValue} watch={watch} />
          <BranchSettingsRuleEditPermissionsField
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <BranchSettingsRuleListField setValue={setValue} watch={watch} />

          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              <ButtonGroup.Root>
                {!isSubmitted ? (
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Create rule' : 'Creating rule...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {}}>
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
