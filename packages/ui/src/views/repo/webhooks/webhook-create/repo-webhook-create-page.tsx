import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, Fieldset, FormWrapper, Message, MessageTheme } from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeCreateWebhookFormSchema } from '@views/repo/webhooks/webhook-create/components/create-webhooks-form-schema'

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
  useTranslationStore: () => TranslationStore
}

export const RepoWebhooksCreatePage: FC<RepoWebhooksCreatePageProps> = ({
  onFormSubmit,
  apiError,
  isLoading,
  onFormCancel,
  useTranslationStore,
  useWebhookStore
}) => {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateWebhookFormFields>({
    resolver: zodResolver(makeCreateWebhookFormSchema(t)),
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

  const { preSetWebhookData } = useWebhookStore()

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
  const triggerValue = watch('trigger')

  const onSubmit: SubmitHandler<CreateWebhookFormFields> = data => {
    onFormSubmit(data)
  }

  return (
    <SandboxLayout.Content className="max-w-[570px] px-0">
      <h1 className="text-foreground-1 mb-10 text-2xl font-medium">
        {preSetWebhookData
          ? t('views:repos.editWebhookTitle', 'Webhook details')
          : t('views:repos.createWebhookTitle', 'Create a webhook')}
      </h1>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <WebhookToggleField register={register} setValue={setValue} watch={watch} t={t} />
        <WebhookNameField register={register} errors={errors} disabled={false} t={t} />
        <WebhookDescriptionField register={register} errors={errors} t={t} />
        <WebhookPayloadUrlField register={register} errors={errors} t={t} />
        <WebhookSecretField register={register} errors={errors} t={t} />
        <WebhookSSLVerificationField setValue={setValue} watch={watch} t={t} />

        <Fieldset legend="Webhook triggers">
          <WebhookTriggerField setValue={setValue} watch={watch} t={t} />
          {triggerValue === TriggerEventsEnum.SELECTED_EVENTS && (
            <div className="flex justify-between">
              {eventSettingsComponents.map(component => (
                <div key={component.fieldName} className="flex flex-col">
                  <WebhookEventSettingsFieldset setValue={setValue} watch={watch} eventList={component.events} t={t} />
                </div>
              ))}
            </div>
          )}
        </Fieldset>

        <ButtonGroup className="mt-7">
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
        </ButtonGroup>

        {!!apiError && (
          <Message className="mt-1" theme={MessageTheme.ERROR}>
            {apiError?.toString()}
          </Message>
        )}
      </FormWrapper>
    </SandboxLayout.Content>
  )
}
