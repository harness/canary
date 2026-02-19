import { IInputDefinition, InputProps } from '@harnessio/forms'

export type SlotFormInputType = 'slot'

export type SlotFormInputValueType = unknown

export type SlotFormInputConfig = {
  debug?: boolean
}

export type SlotFormInputDefinition = IInputDefinition<SlotFormInputConfig, SlotFormInputValueType, SlotFormInputType>

export type SlotFormInputProps = InputProps<SlotFormInputValueType, SlotFormInputConfig> & {
  inputs: IInputDefinition[]
}
