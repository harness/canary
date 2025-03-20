import type { ArrayInputConfig } from './ArrayInput'
import type { BooleanInputConfig } from './BooleanInput'
import type { GroupInputConfig } from './GroupInput'
import type { ListInputConfig } from './ListInput'
import type { NumberInputConfig } from './NumberInput'
import type { RadialInputConfig } from './RadialInput'
import type { SecretSelectInputConfig } from './SecretSelectInput'
import type { SelectInputConfig } from './SelectInput'
import type { TextAreaInputConfig } from './TextAreaInput'
import type { TextInputConfig } from './TextInput'

export type InputType =
  | 'boolean'
  | 'text'
  | 'number'
  | 'array'
  | 'list'
  | 'group'
  | 'textarea'
  | 'select'
  | 'separator'
  | 'radio'
  | 'secretSelect'

export type InputConfigType =
  | BooleanInputConfig
  | TextInputConfig
  | TextAreaInputConfig
  | NumberInputConfig
  | ArrayInputConfig
  | ListInputConfig
  | GroupInputConfig
  | SelectInputConfig
  | RadialInputConfig
  | SecretSelectInputConfig

export interface RadioOption {
  label: string
  description: string
  value: string
  id: string
  title: string
}
