import { FC } from 'react'

import { Checkbox, ControlGroup, FormInput, Label, Radio, StackedList, Switch, Textarea } from '@/components'
import { TriggerEventsEnum, WebhookEvent, WebhookFormFieldProps, WebhookTriggerEnum } from '@/views'

export const WebhookToggleField: FC<WebhookFormFieldProps> = ({ register, watch, setValue, t }) => (
  <StackedList.Root>
    <StackedList.Item
      className="!rounded px-5 py-3"
      disableHover
      isHeader
      actions={
        <Switch
          {...register!('enabled')}
          checked={watch!('enabled')}
          onCheckedChange={() => setValue!('enabled', !watch!('enabled'))}
        />
      }
    >
      <StackedList.Field
        title={t('views:repos.enableWebhookToggle', 'Enable the webhook')}
        description={t('views:repos.toggleDescription', 'We will deliver event details when this hook is triggered')}
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const WebhookNameField: FC<WebhookFormFieldProps & { disabled: boolean }> = ({ register, disabled, t }) => (
  <ControlGroup>
    <FormInput.Text
      id="name"
      {...register!('identifier')}
      placeholder="Name your webhook"
      autoFocus
      disabled={disabled}
      label={t('views:repos.name', 'Name')}
    />
  </ControlGroup>
)

export const WebhookDescriptionField: FC<WebhookFormFieldProps> = ({ register, errors, t }) => (
  <ControlGroup>
    <Textarea
      id="description"
      {...register!('description')}
      placeholder={t('views:repos.descriptionPlaceholder', 'Enter a description')}
      label={t('views:repos.description', 'Description')}
      error={errors?.description?.message?.toString()}
    />
  </ControlGroup>
)

export const WebhookPayloadUrlField: FC<WebhookFormFieldProps> = ({ register, t }) => (
  <ControlGroup>
    <FormInput.Text
      autoComplete="new-password"
      data-form-type="other"
      id="payloadUrl"
      {...register!('url')}
      placeholder={t('views:repos.urlPlaceholder', 'https://example.com/harness')}
      label={t('views:repos.urlLabel', 'Payload URL')}
    />
  </ControlGroup>
)

export const WebhookSecretField: FC<WebhookFormFieldProps> = ({ register, t }) => (
  <ControlGroup>
    <FormInput.Text
      autoComplete="new-password"
      data-form-type="other"
      id="secret"
      {...register!('secret')}
      type="password"
      label={t('views:repos.secret', 'Secret')}
    />
  </ControlGroup>
)

export const WebhookSSLVerificationField: FC<WebhookFormFieldProps> = ({ watch, setValue, t }) => {
  const sslVerificationValue = watch!('insecure')
  const handleAccessChange = (value: string) => {
    setValue!('insecure', value)
  }

  return (
    <ControlGroup className="mt-4">
      <Label htmlFor="insecure" className="mb-6">
        {t('views:repos.sslVerification', 'SSL Verification')}
      </Label>
      <Radio.Root value={sslVerificationValue} onValueChange={handleAccessChange} id="insecure">
        <Radio.Item
          id="enable-ssl"
          value="1"
          label={t('views:repos.sslVerificationLabel', 'Enable SSL Verification')}
        />
        <Radio.Item
          id="disable-ssl"
          value="2"
          label={t('views:repos.disableSslLabel', 'Disable SSL verification')}
          caption={t('views:repos.disableSslDescription', 'Not recommended for production use')}
        />
      </Radio.Root>
    </ControlGroup>
  )
}

export const WebhookTriggerField: FC<WebhookFormFieldProps> = ({ watch, setValue, t }) => {
  const sslVerificationValue = watch!('trigger')
  const handleTriggerChange = (value: string) => {
    setValue!('trigger', value)
    if (value === TriggerEventsEnum.ALL_EVENTS) {
      setValue!('triggers', [])
    }
  }

  return (
    <ControlGroup className="mt-4">
      <Label htmlFor="trigger" className="mb-6">
        {t('views:repos.evenTriggerLabel', 'Which events would you like to use to trigger this webhook?')}
      </Label>
      <Radio.Root value={sslVerificationValue} onValueChange={handleTriggerChange} id="trigger">
        <Radio.Item id="all-events" value="1" label={t('views:repos.evenTriggerAllLabel', 'Send me everything')} />
        <Radio.Item
          id="select-events"
          value="2"
          label={t('views:repos.eventTriggerIndividualLabel', 'Let me select individual events')}
        />
      </Radio.Root>
    </ControlGroup>
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
        <ControlGroup key={event.id} className="min-h-8 justify-center">
          <Checkbox
            checked={currentArray?.includes(event.id as WebhookTriggerEnum)}
            onCheckedChange={() => handleCheckboxChange(event.id as WebhookTriggerEnum)}
            id={`${event.id}`}
            label={event.event}
          />
        </ControlGroup>
      ))}
    </>
  )
}
