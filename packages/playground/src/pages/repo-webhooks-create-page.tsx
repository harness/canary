import React from 'react'
import { Button, ButtonGroup, useZodForm, Text } from '@harnessio/canary'
import { SubmitHandler } from 'react-hook-form'
import {
  WebhookToggleField,
  WebhookNameField,
  WebhookDescriptionField,
  WebhookPayloadUrlField,
  WebhookSecretField,
  WebhookSSLVerificationField,
  WebhookTriggerField,
  WebhookEventSettingsFieldset
} from '../components/webhooks/create-webhooks-form-fields'
import { branchEvents, tagEvents, prEvents } from '../components/webhooks/create-webhook-form-data'

import { FormFieldSet, SandboxLayout } from '../index'
import { createWebhookFormSchema, CreateWebhookFormFields } from '../components/webhooks/create-webhooks-form-schema'
import { EventTypes } from '../components/webhooks/types'
export const RepoWebhooksCreatePage: React.FC = () => {
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
      state: true,
      name: '',
      description: '',
      payloadUrl: '',
      secret: '',
      sslVerification: '1',
      trigger: '1',
      branchEvents: [],
      tagEvents: [],
      prEvents: []
    }
  })

  const eventSettingsComponents = [
    { fieldName: 'branchEvents', events: branchEvents },
    { fieldName: 'tagEvents', events: tagEvents },
    { fieldName: 'prEvents', events: prEvents }
  ]
  const triggerValue = watch('trigger')

  const onSubmit: SubmitHandler<CreateWebhookFormFields> = data => {
    console.log(data)
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
              <WebhookNameField register={register} errors={errors} disabled={false} />
              <WebhookDescriptionField register={register} errors={errors} />
              <WebhookPayloadUrlField register={register} errors={errors} />
              <WebhookSecretField register={register} errors={errors} />
              <WebhookSSLVerificationField setValue={setValue} watch={watch} />
              <WebhookTriggerField setValue={setValue} watch={watch} />
              {triggerValue === '2' && (
                <div className="flex justify-between">
                  {eventSettingsComponents.map(component => (
                    <div key={component.fieldName} className="flex flex-col">
                      <WebhookEventSettingsFieldset
                        setValue={setValue}
                        watch={watch}
                        eventList={component.events}
                        fieldName={component.fieldName as keyof EventTypes}
                      />
                    </div>
                  ))}
                </div>
              )}

              <FormFieldSet.Root className="mt-0">
                <FormFieldSet.ControlGroup>
                  <ButtonGroup.Root>
                    <>
                      <Button type="submit" size="sm" disabled={!isValid}>
                        Create webhook
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
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
