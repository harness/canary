import { FC } from 'react'

import {
  Checkbox,
  ControlGroup,
  Input,
  Label,
  Option,
  RadioGroup,
  RadioButton as RadioGroupItem,
  StackedList,
  Switch,
  Textarea
} from '@/components'
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

export const WebhookNameField: FC<WebhookFormFieldProps & { disabled: boolean }> = ({
  register,
  errors,
  disabled,
  t
}) => (
  <ControlGroup>
    <Input
      id="name"
      {...register!('identifier')}
      placeholder="Name your webhook"
      autoFocus
      disabled={disabled}
      label={t('views:repos.name', 'Name')}
      error={errors?.identifier?.message?.toString()}
      size="md"
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

export const WebhookPayloadUrlField: FC<WebhookFormFieldProps> = ({ register, errors, t }) => (
  <ControlGroup>
    <Input
      autoComplete="new-password"
      data-form-type="other"
      id="payloadUrl"
      {...register!('url')}
      placeholder={t('views:repos.urlPlaceholder', 'https://example.com/harness')}
      label={t('views:repos.urlLabel', 'Payload URL')}
      error={errors?.url?.message?.toString()}
      size="md"
    />
  </ControlGroup>
)

export const WebhookSecretField: FC<WebhookFormFieldProps> = ({ register, errors, t }) => (
  <ControlGroup>
    <Input
      autoComplete="new-password"
      data-form-type="other"
      id="secret"
      {...register!('secret')}
      type="password"
      label={t('views:repos.secret', 'Secret')}
      error={errors?.secret?.message?.toString()}
      size="md"
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
      <RadioGroup value={sslVerificationValue} onValueChange={handleAccessChange} id="insecure">
        <Option
          control={<RadioGroupItem value="1" id="enable-ssl" />}
          id="enable-ssl"
          label={t('views:repos.sslVerificationLabel', 'Enable SSL Verification')}
        />
        <Option
          control={<RadioGroupItem value="2" id="disable-ssl" />}
          id="disable-ssl"
          label={t('views:repos.disableSslLabel', 'Disable SSL verification')}
          description={t('views:repos.disableSslDescription', 'Not recommended for production use')}
        />
      </RadioGroup>
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
      <RadioGroup value={sslVerificationValue} onValueChange={handleTriggerChange} id="trigger">
        <Option
          control={<RadioGroupItem value="1" id="all-events" />}
          id="all-events"
          label={t('views:repos.evenTriggerAllLabel', 'Send me everything')}
        />
        <Option
          control={<RadioGroupItem value="2" id="select-events" />}
          id="select-events"
          label={t('views:repos.eventTriggerIndividualLabel', 'Let me select individual events')}
        />
      </RadioGroup>
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
