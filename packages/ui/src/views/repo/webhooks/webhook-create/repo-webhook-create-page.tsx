import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonLayout, Fieldset, FormWrapper, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout, WebhookStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWebhookFormSchema } from '@views/repo/webhooks/webhook-create/components/create-webhooks-form-schema'

import { getBranchEvents, getPrEvents, getTagEvents } from './components/create-webhook-form-data'
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
  // preSetWebHookData: CreateWebhookFormFields | null
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
    { fieldName: 'branchEvents', events: getBranchEvents(t) },
    { fieldName: 'tagEvents', events: getTagEvents(t) },
    { fieldName: 'prEvents', events: getPrEvents(t) }
  ]

  const onSubmit: SubmitHandler<CreateWebhookFormFields> = data => {
    onFormSubmit(data)
  }

  return (
    <SandboxLayout.Content className="max-w-[570px] px-0">
      <Text as="h1" variant="heading-section" color="foreground-1" className="mb-10">
        {preSetWebhookData
          ? t('views:repos.editWebhookTitle', 'Webhook details')
          : t('views:repos.createWebhookTitle', 'Create a webhook')}
      </Text>
      <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
        <Fieldset>
          <WebhookToggleField register={register} setValue={setValue} watch={watch} />
        </Fieldset>
        <Fieldset>
          <WebhookNameField register={register} />
        </Fieldset>
        <Fieldset>
          <WebhookDescriptionField register={register} />
        </Fieldset>
        <Fieldset>
          <WebhookPayloadUrlField register={register} />
        </Fieldset>
        <Fieldset>
          <WebhookSecretField register={register} />
        </Fieldset>
        <Fieldset>
          <WebhookSSLVerificationField register={register} />
        </Fieldset>
        <Fieldset>
          <WebhookTriggerField register={register} />
          {triggerValue === TriggerEventsEnum.SELECTED_EVENTS && (
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
          )}
        </Fieldset>

        <Fieldset className="mt-7">
          <ButtonLayout horizontalAlign="start">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? preSetWebhookData
                  ? t('views:repos.updatingWebhook', 'Updating webhook...')
                  : t('views:repos.creatingWebhook', 'Creating webhook...')
                : preSetWebhookData
                  ? t('views:repos.updateWebhook', 'Update webhook')
                  : t('views:repos.createWebhook', 'Create webhook')}
            </Button>
            <Button type="button" variant="outline" onClick={onFormCancel}>
              {t('views:repos.cancel', 'Cancel')}
            </Button>
          </ButtonLayout>
        </Fieldset>

        {!!apiError && <span className="text-2 text-cn-foreground-danger">{apiError?.toString()}</span>}
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
