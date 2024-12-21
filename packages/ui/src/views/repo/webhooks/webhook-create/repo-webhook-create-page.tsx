import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'

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

export const RepoWebhooksCreatePage: React.FC<RepoWebhooksCreatePageProps> = ({
  onFormSubmit,
  apiError,
  isLoading,
  onFormCancel,
  useTranslationStore,
  useWebhookStore
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
  const { t } = useTranslationStore()

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
  }, [preSetWebhookData])

  const eventSettingsComponents = [
    { fieldName: 'branchEvents', events: getBranchEvents(t) },
    { fieldName: 'tagEvents', events: getTagEvents(t) },
    { fieldName: 'prEvents', events: getPrEvents(t) }
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
            {t('views:repos.createWebhookTitle', 'Create a webhook')}
          </Text>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <WebhookToggleField register={register} setValue={setValue} watch={watch} t={t} />
              <WebhookNameField register={register} errors={errors} disabled={false} t={t} />
              <WebhookDescriptionField register={register} errors={errors} t={t} />
              <WebhookPayloadUrlField register={register} errors={errors} t={t} />
              <WebhookSecretField register={register} errors={errors} t={t} />
              <WebhookSSLVerificationField setValue={setValue} watch={watch} t={t} />
              <WebhookTriggerField setValue={setValue} watch={watch} t={t} />
              {triggerValue === TriggerEventsEnum.SELECTED_EVENTS && (
                <div className="flex justify-between">
                  {eventSettingsComponents.map(component => (
                    <div key={component.fieldName} className="flex flex-col">
                      <WebhookEventSettingsFieldset
                        setValue={setValue}
                        watch={watch}
                        eventList={component.events}
                        t={t}
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

              <Fieldset className="mt-0">
                <ControlGroup>
                  <ButtonGroup>
                    <>
                      <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                        {isLoading
                          ? preSetWebhookData
                            ? t('views:repos.updatingWebhook', 'Updating webhook...')
                            : t('views:repos.creatingWebhook', 'Creating webhook...')
                          : preSetWebhookData
                            ? t('views:repos.updateWebhook', 'Update webhook')
                            : t('views:repos.createWebhook', 'Create webhook')}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={onFormCancel}>
                        {t('views:repos.cancel', 'Cancel')}
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
