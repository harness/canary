import React from 'react'
import { Button, ButtonGroup, useZodForm, Text, Spacer } from '@harnessio/canary'
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
import { createWebhookFormSchema } from '../components/webhooks/create-webhooks-form-schema'
import { EventTypes, CreateWebhookFormFields, TriggerEventsEnum } from '../components/webhooks/types'

interface RepoWebhooksCreatePageProps {
  onFormSubmit: (data: CreateWebhookFormFields) => void
  onFormCancel: () => void
  apiError?: string | null
  isLoading: boolean
}

export const RepoWebhooksCreatePage: React.FC<RepoWebhooksCreatePageProps> = ({
  onFormSubmit,
  apiError,
  isLoading,
  onFormCancel
}) => {
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
      enabled: true,
      identifier: '',
      description: '',
      url: '',
      secret: '',
      insecure: '1',
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
    onFormSubmit(data)
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
              {triggerValue === TriggerEventsEnum.SELECTED_EVENTS && (
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

              {apiError && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {apiError?.toString()}
                  </Text>
                </>
              )}

              <FormFieldSet.Root className="mt-0">
                <FormFieldSet.ControlGroup>
                  <ButtonGroup.Root>
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                        {isLoading ? 'Creating webhook...' : 'Create webhook'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={onFormCancel}>
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
