import { FC } from 'react'

import { Checkbox, FormInput, Radio, Switch } from '@/components'
import { useTranslation } from '@/context'
import { WebhookEvent, WebhookFormFieldProps, WebhookTriggerEnum } from '@/views'

export const WebhookToggleField: FC<WebhookFormFieldProps> = ({ register, watch, setValue }) => {
  const { t } = useTranslation()
  return (
    <Switch
      {...register('enabled')}
      checked={watch!('enabled')}
      onCheckedChange={() => setValue!('enabled', !watch!('enabled'))}
      label={t('views:repos.enableWebhookToggle', 'Enable the webhook')}
      caption={t('views:repos.toggleDescription', 'We will deliver event details when this hook is triggered')}
    />
  )
}

export const WebhookNameField: FC<WebhookFormFieldProps & { disabled?: boolean }> = ({ register, disabled }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Text
      id="name"
      {...register('identifier')}
      placeholder="Name your webhook"
      autoFocus
      disabled={disabled}
      label={t('views:repos.name', 'Name')}
    />
  )
}

export const WebhookDescriptionField: FC<WebhookFormFieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Textarea
      id="description"
      {...register('description')}
      placeholder={t('views:repos.descriptionPlaceholder', 'Enter a description')}
      label={t('views:repos.description', 'Description')}
      resizable
      className="min-h-[136px]"
    />
  )
}

export const WebhookPayloadUrlField: FC<WebhookFormFieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Text
      autoComplete="new-password"
      data-form-type="other"
      id="payloadUrl"
      {...register('url')}
      placeholder={t('views:repos.urlPlaceholder', 'https://example.com/harness')}
      label={t('views:repos.urlLabel', 'Payload URL')}
    />
  )
}

export const WebhookSecretField: FC<WebhookFormFieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Text
      autoComplete="new-password"
      data-form-type="other"
      id="secret"
      {...register('secret')}
      type="password"
      label={t('views:repos.secret', 'Secret')}
    />
  )
}

export const WebhookSSLVerificationField: FC<WebhookFormFieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Radio
      label={t('views:repos.sslVerification', 'SSL Verification')}
      id="insecure"
      {...register('insecure')}
      className="gap-y-cn-sm"
    >
      <Radio.Item id="enable-ssl" value="1" label={t('views:repos.sslVerificationLabel', 'Enable SSL Verification')} />
      <Radio.Item
        id="disable-ssl"
        value="2"
        label={t('views:repos.disableSslLabel', 'Disable SSL verification')}
        caption={t('views:repos.disableSslDescription', 'Not recommended for production use')}
      />
    </FormInput.Radio>
  )
}

export const WebhookTriggerField: FC<WebhookFormFieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Radio
      label={t('views:repos.evenTriggerLabel', 'Which events would you like to use to trigger this webhook?')}
      id="trigger"
      {...register('trigger')}
      className="gap-y-cn-sm"
    >
      <Radio.Item id="all-events" value="1" label={t('views:repos.evenTriggerAllLabel', 'Send me everything')} />
      <Radio.Item
        id="select-events"
        value="2"
        label={t('views:repos.eventTriggerIndividualLabel', 'Let me select individual events')}
      />
    </FormInput.Radio>
  )
}

export const WebhookEventSettingsFieldset: FC<WebhookFormFieldProps & { eventList: WebhookEvent[] }> = ({
  watch,
  setValue,
  eventList
}) => {
  const currentArray = (watch!('triggers') || []) as WebhookTriggerEnum[]

  const handleCheckboxChange = (eventId: WebhookTriggerEnum) => {
    if (currentArray.includes(eventId)) {
      setValue!('triggers', currentArray.filter(e => e !== eventId) as WebhookTriggerEnum[])
    } else {
      setValue!('triggers', [...currentArray, eventId])
    }
  }

  return (
    <>
      {eventList.map(event => (
        <Checkbox
          key={event.id}
          checked={currentArray?.includes(event.id as WebhookTriggerEnum)}
          onCheckedChange={() => handleCheckboxChange(event.id as WebhookTriggerEnum)}
          id={`${event.id}`}
          label={event.event}
        />
      ))}
    </>
  )
}
