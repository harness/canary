import { Checkbox, Input, RadioGroup, RadioGroupItem, StackedList, Switch } from '@harnessio/canary'
import { Textarea } from '@harnessio/ui/components'

import { FormFieldSet, MessageTheme } from '../../index'
import { TriggerEventsEnum, WebhookEvent, WebhookFormFieldProps, WebhookTriggerEnum } from './types'

export const WebhookToggleField: React.FC<WebhookFormFieldProps> = ({ register, watch, setValue }) => (
  <StackedList.Root className="bg-tertiary/2 border-none" borderBackground>
    <StackedList.Item disableHover isHeader>
      <StackedList.Field
        title="Enable the webhook"
        description="We will deliver event details when this hook is triggered"
      />
      <StackedList.Field
        label
        secondary
        title={
          <div className="flex cursor-pointer items-center justify-end gap-1.5">
            <Switch
              {...register!('enabled')}
              checked={watch!('enabled')}
              onCheckedChange={() => setValue!('enabled', !watch!('enabled'))}
            />
          </div>
        }
        right
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const WebhookNameField: React.FC<WebhookFormFieldProps & { disabled: boolean }> = ({
  register,
  errors,
  disabled
}) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="name" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register!('identifier')} placeholder="Name your webhook" autoFocus disabled={disabled} />
    {errors!.identifier && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.identifier.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookDescriptionField: React.FC<WebhookFormFieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="description">Description</FormFieldSet.Label>
    <Textarea id="description" {...register!('description')} placeholder="Enter a description of this rule..." />
    {errors!.description && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.description.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookPayloadUrlField: React.FC<WebhookFormFieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="payloadUrl" required>
      Payload URL
    </FormFieldSet.Label>
    <Input id="payloadUrl" {...register!('url')} placeholder="https://example.com/harness" />
    {errors!.url && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.url.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSecretField: React.FC<WebhookFormFieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="secret">Secret</FormFieldSet.Label>
    <Input id="secret" {...register!('secret')} type="password" />
    {errors!.secret && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.secret.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSSLVerificationField: React.FC<WebhookFormFieldProps> = ({ watch, setValue }) => {
  const sslVerificationValue = watch!('insecure')
  const handleAccessChange = (value: string) => {
    setValue!('insecure', value)
  }

  return (
    <FormFieldSet.Root className="mb-0">
      <FormFieldSet.ControlGroup>
        <FormFieldSet.Label htmlFor="insecure" required>
          SSL Verification
        </FormFieldSet.Label>
        <RadioGroup value={sslVerificationValue} onValueChange={handleAccessChange} id="insecure">
          <FormFieldSet.Option
            control={<RadioGroupItem value="1" id="enable-ssl" />}
            id="enable-ssl"
            label="Enable SSL Verification"
          />
          <FormFieldSet.Option
            control={<RadioGroupItem value="2" id="disable-ssl" />}
            id="disable-ssl"
            label="Disable SSL verification"
            description="Not recommended for production use"
          />
        </RadioGroup>
      </FormFieldSet.ControlGroup>
    </FormFieldSet.Root>
  )
}

export const WebhookTriggerField: React.FC<WebhookFormFieldProps> = ({ watch, setValue }) => {
  const sslVerificationValue = watch!('trigger')
  const handleTriggerChange = (value: string) => {
    setValue!('trigger', value)
    if (value === TriggerEventsEnum.ALL_EVENTS) {
      setValue!('triggers', [])
    }
  }

  return (
    <FormFieldSet.Root className="mb-0">
      <FormFieldSet.ControlGroup>
        <FormFieldSet.Label htmlFor="trigger" required>
          Which events would you like to use to trigger this webhook?
        </FormFieldSet.Label>
        <RadioGroup value={sslVerificationValue} onValueChange={handleTriggerChange} id="trigger">
          <FormFieldSet.Option
            control={<RadioGroupItem value="1" id="all-events" />}
            id="all-events"
            label="Send me everything"
          />
          <FormFieldSet.Option
            control={<RadioGroupItem value="2" id="select-events" />}
            id="select-events"
            label="Let me select individual events"
          />
        </RadioGroup>
      </FormFieldSet.ControlGroup>
    </FormFieldSet.Root>
  )
}

export const WebhookEventSettingsFieldset: React.FC<WebhookFormFieldProps & { eventList: WebhookEvent[] }> = ({
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

  return eventList.map(event => (
    <FormFieldSet.ControlGroup key={event.id} className="min-h-8 justify-center">
      <FormFieldSet.Option
        control={
          <Checkbox
            checked={currentArray?.includes(event.id as WebhookTriggerEnum)}
            onCheckedChange={() => handleCheckboxChange(event.id as WebhookTriggerEnum)}
            id={`${event.id}`}
          />
        }
        id={`${event.id}`}
        label={event.event}
      />
    </FormFieldSet.ControlGroup>
  ))
}
