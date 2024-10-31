import React, { useReducer, useEffect } from 'react'
import { Button, ButtonGroup, useZodForm, Spacer, Text } from '@harnessio/canary'
import { SubmitHandler } from 'react-hook-form'
import {
  WebhookToggleField,
  WebhookNameField,
  WebhookDescriptionField,
  WebhookPayloadUrlField,
  WebhookSecretField,
  WebhookSSLVerificationField
} from '../components/webhooks/create-webhooks-form-fields'
import { FormFieldSet, SandboxLayout } from '../index'
import { createWebhookFormSchema, CreateWebhookFormFields } from '../components/webhooks/create-webhooks-form-schema'
import {
  RepoBranchSettingsFormFields,
  BypassUsersList,
  ActionType,
  MergeStrategy
} from '../components/repo-settings/repo-branch-settings-rules/types'
import { NavLink } from 'react-router-dom'

// type BranchSettingsErrors = {
//   principals: string | null
//   statusChecks: string | null
//   addRule: string | null
//   updateRule: string | null
// }

// interface RepoBranchSettingsRulesPageProps {
//   isLoading?: boolean
//   handleRuleUpdate: (data: RepoBranchSettingsFormFields) => void
//   principals?: BypassUsersList[]
//   recentStatusChecks?: string[]
//   apiErrors?: BranchSettingsErrors
//   preSetRuleData?: RepoBranchSettingsFormFields | null
// }

export const RepoWebhooksCreatePage: React.FC = (
  {
    //   isLoading,
    //   handleRuleUpdate,
    //   principals,
    //   recentStatusChecks,
    //   apiErrors,
    //   preSetRuleData
  }
) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useZodForm({
    schema: createWebhookFormSchema,
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      payloadUrl: '',
      secret: '',
      sslVerification: '1'
      //   trigger: '1'
    }
  })

  const onSubmit: SubmitHandler<CreateWebhookFormFields> = data => {
    console.log(data)
    // handleRuleUpdate(formData)
    reset()
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
        <SandboxLayout.Content maxWidth="2xl">
          <Text size={5} weight="medium" as="div" className="mb-8">
            Create a webhook
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormFieldSet.Root>
              <WebhookToggleField register={register} setValue={setValue} watch={watch} />
              <WebhookNameField register={register} errors={errors} />
              <WebhookDescriptionField register={register} errors={errors} />
              <WebhookPayloadUrlField register={register} errors={errors} />
              <WebhookSecretField register={register} errors={errors} />
              <WebhookSSLVerificationField register={register} errors={errors} setValue={setValue} watch={watch} />
              {/*<BranchSettingsRuleTargetPatternsField
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

          {apiErrors &&
            (apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule || apiErrors.updateRule) && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {apiErrors.principals || apiErrors.statusChecks || apiErrors.addRule}
                </Text>
              </>
            )}*/}

              <FormFieldSet.Root className="mt-0">
                <FormFieldSet.ControlGroup>
                  <ButtonGroup.Root>
                    {/* {!preSetRuleData ? ( */}
                    <>
                      <Button type="submit" size="sm" /*disabled={/*!isValid*/ /*|| isLoading*/>
                        {/* {!isLoading ? 'Create rule' : 'Creating rule...'} */}
                        Create webhook
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <NavLink to="../general">Cancel</NavLink>
                      </Button>
                    </>
                    {/*} ) : ( 
                    // <>
                    //   <Button type="submit" size="sm" disabled={!isValid | isLoading}>
                    //     {!isLoading ? 'Update rule' : 'Updating rule...'}
                    //   </Button>
                    //   <Button type="button" variant="outline" size="sm">
                    //     <NavLink to="../general">Cancel</NavLink>
                    //   </Button>
                    // </>
                    {/* )} */}
                  </ButtonGroup.Root>
                </FormFieldSet.ControlGroup>
              </FormFieldSet.Root>
            </FormFieldSet.Root>
          </form>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}
