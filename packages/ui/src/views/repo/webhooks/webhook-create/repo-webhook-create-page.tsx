import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, Fieldset, FormSeparator, FormWrapper, Layout, Text } from '@/components'
import { useTranslation } from '@/context'
import { WebhookStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWebhookFormSchema } from '@views/repo/webhooks/webhook-create/components/create-webhooks-form-schema'

import { getBranchAndTagEvents, getPrActivityEvents, getPrEvents } from './components/create-webhook-form-data'
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
  useWebhookStore: () => WebhookStore
}

export const RepoWebhooksCreatePage: FC<RepoWebhooksCreatePageProps> = ({
  onFormSubmit,
  apiError,
  isLoading,
  onFormCancel,
  useWebhookStore
}) => {
  const { t } = useTranslation()

  const formMethods = useForm<CreateWebhookFormFields>({
    resolver: zodResolver(createWebhookFormSchema),
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

  const { register, handleSubmit, setValue, watch, reset } = formMethods

  const { preSetWebhookData } = useWebhookStore()

  const triggerValue = watch('trigger')

  useEffect(() => {
    if (triggerValue === TriggerEventsEnum.ALL_EVENTS) {
      setValue('triggers', [])
    }
  }, [triggerValue])

  useEffect(() => {
    if (preSetWebhookData) {
      setValue('identifier', preSetWebhookData.identifier)
      setValue('description', preSetWebhookData.description)
      setValue('url', preSetWebhookData.url)
      setValue('enabled', preSetWebhookData.enabled)
      setValue('insecure', preSetWebhookData.insecure)
      setValue('trigger', preSetWebhookData.trigger)
      setValue('triggers', preSetWebhookData.triggers)
    } else {
      reset()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSetWebhookData])

  const eventSettingsComponents = [
    { fieldName: 'branchAndTagEvents', events: getBranchAndTagEvents(t) },
    { fieldName: 'prEvents', events: getPrEvents(t) },
    { fieldName: 'prActivityEvents', events: getPrActivityEvents(t) }
  ]

  const onSubmit: SubmitHandler<CreateWebhookFormFields> = data => {
    if (data.trigger === TriggerEventsEnum.SELECTED_EVENTS && (!data.triggers || data.triggers.length === 0)) {
      formMethods.setError('triggers', {
        type: 'manual',
        message: 'At least one event must be selected'
      })
      return
    }
    onFormSubmit(data)
  }

  return (
    <Layout.Vertical className="settings-form-width" gapY="md">
      <Text as="h1" variant="heading-section">
        {preSetWebhookData
          ? t('views:repos.editWebhookTitle', 'Order Status Update Webhook')
          : t('views:repos.createWebhookTitle', 'Create a webhook')}
      </Text>

      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <WebhookToggleField register={register} setValue={setValue} watch={watch} />
        <FormSeparator />

        {preSetWebhookData && (
          <Text as="h2" variant="heading-subsection">
            {t('views:repos.webhookDetails', 'Details')}
          </Text>
        )}

        <WebhookNameField register={register} />
        <WebhookDescriptionField register={register} />
        <WebhookPayloadUrlField register={register} />
        <WebhookSecretField register={register} />
        <WebhookSSLVerificationField register={register} />

        <Fieldset>
          <WebhookTriggerField register={register} />
          {triggerValue === TriggerEventsEnum.SELECTED_EVENTS && (
            <>
              <div className="flex justify-between">
                {eventSettingsComponents.map(component => (
                  <div key={component.fieldName} className="flex flex-col">
                    <WebhookEventSettingsFieldset
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      eventList={component.events}
                    />
                  </div>
                ))}
              </div>
              {formMethods.formState.errors.triggers && (
                <Alert.Root theme="danger">
                  <Alert.Title>{formMethods.formState.errors.triggers.message}</Alert.Title>
                </Alert.Root>
              )}
            </>
          )}
        </Fieldset>

        <ButtonLayout horizontalAlign="start">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? preSetWebhookData
                ? t('views:repos.updatingWebhook', 'Updating Webhook...')
                : t('views:repos.creatingWebhook', 'Creating Webhook...')
              : preSetWebhookData
                ? t('views:repos.updateWebhook', 'Update Webhook')
                : t('views:repos.createWebhook', 'Create Webhook')}
          </Button>
          <Button type="button" variant="outline" onClick={onFormCancel}>
            {t('views:repos.cancel', 'Cancel')}
          </Button>
        </ButtonLayout>

        {!!apiError && (
          <Alert.Root theme="danger">
            <Alert.Title>{apiError?.toString()}</Alert.Title>
          </Alert.Root>
        )}
      </FormWrapper>
    </Layout.Vertical>
  )
}
