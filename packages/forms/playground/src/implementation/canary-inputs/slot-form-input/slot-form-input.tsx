import { JSX, memo } from 'react'

import { InputComponent, RenderInputs } from '@harnessio/forms'

import { SlotFormInputProps, SlotFormInputValueType } from './slot-form-input-types'

const SlotFormInputInternal = memo(function SlotFormInputInternal(props: SlotFormInputProps): JSX.Element {
  const { factory, input } = props
  const { label, description, inputs = [], inputConfig = { debug: false } } = input

  if (inputConfig.debug) {
    return (
      <div className="border-border bg-background p-cn-md rounded-cn-6 border">
        {label && <div className="mb-cn-sm text-sm font-medium">{label}</div>}
        {description && <div className="text-muted-foreground mb-cn-md text-xs">{description}</div>}
        <RenderInputs items={inputs} factory={factory} />
      </div>
    )
  }

  return <RenderInputs items={inputs} factory={factory} withoutWrapper={true} />
})

export class SlotFormInput extends InputComponent<SlotFormInputValueType> {
  public internalType = 'slot'

  renderComponent(props: SlotFormInputProps): JSX.Element {
    return <SlotFormInputInternal {...props} />
  }
}
