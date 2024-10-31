import React from 'react'
import { Input, Textarea, Checkbox, StackedList, Switch, RadioGroup, RadioGroupItem } from '@harnessio/canary'
import { FormFieldSet, MessageTheme } from '../../index'
import { WebhookEvent, FieldProps, BranchEvents, TagEvents, PREvents, EventTypes } from './types'

export const WebhookToggleField: React.FC<FieldProps> = ({ register, watch, setValue }) => (
  <StackedList.Root className="border-none">
    <StackedList.Item disableHover isHeader>
      <StackedList.Field
        title="Enable the webhook"
        description="We will deliver event details when this hook is triggered"
      />
      <StackedList.Field
        label
        secondary
        title={
          <div className="flex gap-1.5 items-center justify-end cursor-pointer">
            <Switch
              {...register!('state')}
              checked={watch!('state')}
              onCheckedChange={() => setValue!('state', !watch!('state'))}
            />
          </div>
        }
        right
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const WebhookNameField: React.FC<FieldProps & { disabled: boolean }> = ({ register, errors, disabled }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="name" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register!('name')} placeholder="Name your webhook" autoFocus disabled={disabled} />
    {errors!.name && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.name.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookDescriptionField: React.FC<FieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="description" required>
      Description
    </FormFieldSet.Label>
    <Textarea id="description" {...register!('description')} placeholder="Enter a description of this rule..." />
    {errors!.description && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.description.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookPayloadUrlField: React.FC<FieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="payloadUrl" required>
      Payload URL
    </FormFieldSet.Label>
    <Input id="payloadUrl" {...register!('payloadUrl')} placeholder="https://example.com/harness" />
    {errors!.payloadUrl && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.payloadUrl.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSecretField: React.FC<FieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="secret" required>
      Secret
    </FormFieldSet.Label>
    <Input id="secret" {...register!('secret')} type="password" />
    {errors!.secret && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.secret.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const WebhookSSLVerificationField: React.FC<FieldProps> = ({ watch, setValue }) => {
  const sslVerificationValue = watch!('sslVerification')
  const handleAccessChange = (value: string) => {
    setValue!('sslVerification', value as '1' | '2')
  }

  return (
    <FormFieldSet.Root className="mb-0">
      <FormFieldSet.ControlGroup>
        <FormFieldSet.Label htmlFor="sslVerification" required>
          SSL Verification
        </FormFieldSet.Label>
        <RadioGroup value={sslVerificationValue} onValueChange={handleAccessChange} id="sslVerification">
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

export const WebhookTriggerField: React.FC<FieldProps> = ({ watch, setValue }) => {
  const sslVerificationValue = watch!('trigger')
  const handleTriggerChange = (value: string) => {
    setValue!('trigger', value as '1' | '2')
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

export const WebhookEventSettingsFieldset: React.FC<
  FieldProps & { fieldName: keyof EventTypes; eventList: WebhookEvent[] }
> = ({ watch, setValue, eventList, fieldName }) => {
  const currentArray = (watch!(fieldName) || []) as EventTypes[typeof fieldName][]

  const handleCheckboxChange = (eventName: BranchEvents | TagEvents | PREvents) => {
    if (currentArray.includes(eventName)) {
      setValue!(fieldName, currentArray.filter(e => e !== eventName) as BranchEvents[] | TagEvents[] | PREvents[])
    } else {
      setValue!(fieldName, [...currentArray, eventName] as BranchEvents[] | TagEvents[] | PREvents[])
    }
  }

  return eventList.map(event => (
    <FormFieldSet.ControlGroup key={event.id} className="min-h-8 justify-center">
      <FormFieldSet.Option
        control={
          <Checkbox
            checked={currentArray?.includes(event.event as BranchEvents | TagEvents | PREvents)}
            onCheckedChange={() => handleCheckboxChange(event.event as BranchEvents | TagEvents | PREvents)}
            id={`${fieldName}_${event.id}`}
          />
        }
        id={`${fieldName}_${event.id}`}
        label={event.event}
      />
    </FormFieldSet.ControlGroup>
  ))
}
