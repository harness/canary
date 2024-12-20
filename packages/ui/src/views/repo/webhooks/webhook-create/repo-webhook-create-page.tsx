import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'

import { branchEvents, prEvents, tagEvents } from './components/create-webhook-form-data'
import {
  WebhookDescriptionField,
  WebhookEventSettingsFieldset,
  WebhookNameField,
  WebhookPayloadUrlField,
  WebhookSecretField,
  WebhookSSLVerificationField,
  WebhookToggleField,
  WebhookTriggerField
} from './components/create-webhooks-form-fields'
import { CreateWebhookFormFields, TriggerEventsEnum } from './types'

interface RepoWebhooksCreatePageProps {
  onFormSubmit: (data: CreateWebhookFormFields) => void
  onFormCancel: () => void
  apiError?: string | null
  isLoading: boolean
  preSetWebHookData: CreateWebhookFormFields | null
}

export const RepoWebhooksCreatePage: React.FC<RepoWebhooksCreatePageProps> = ({
  onFormSubmit,
  apiError,
  isLoading,
  onFormCancel,
  preSetWebHookData
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateWebhookFormFields>({
    mode: 'onChange',
    defaultValues: {
      enabled: true,
      identifier: '',
      description: '',
      url: '',
      secret: '',
      insecure: '1',
      trigger: '1',
      triggers: []
    }
  })

  useEffect(() => {
    if (preSetWebHookData) {
      setValue('identifier', preSetWebHookData.identifier)
      setValue('description', preSetWebHookData.description)
      setValue('url', preSetWebHookData.url)
      setValue('enabled', preSetWebHookData.enabled)
      setValue('insecure', preSetWebHookData.insecure)
      setValue('trigger', preSetWebHookData.trigger)
      setValue('triggers', preSetWebHookData.triggers)
    }
  }, [preSetWebHookData])

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
      <SandboxLayout.Main>
        <SandboxLayout.Content maxWidth="2xl" className="ml-0">
          <Text size={5} weight="medium" as="div" className="mb-8">
            Create a webhook
          </Text>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
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
                      <WebhookEventSettingsFieldset setValue={setValue} watch={watch} eventList={component.events} />
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

              <Fieldset className="mt-0">
                <ControlGroup>
                  <ButtonGroup>
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                        {isLoading
                          ? preSetWebHookData
                            ? 'Updating webhook...'
                            : 'Creating webhook...'
                          : preSetWebHookData
                            ? 'Update webhook'
                            : 'Create webhook'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={onFormCancel}>
                        Cancel
                      </Button>
                    </>
                  </ButtonGroup>
                </ControlGroup>
              </Fieldset>
            </Fieldset>
          </FormWrapper>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}
