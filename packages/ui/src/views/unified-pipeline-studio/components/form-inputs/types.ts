import type { ArrayInputConfig } from './ArrayInput'
import type { BooleanInputConfig } from './BooleanInput'
import type { GroupInputConfig } from './GroupInput'
import type { ListInputConfig } from './ListInput'
import type { NumberInputConfig } from './NumberInput'
import type { RadialInputConfig } from './RadialInput'
import type { SelectInputConfig } from './SelectInput'
import type { TextAreaInputConfig } from './TextAreaInput'
import type { TextInputConfig } from './TextInput'

export enum InputType {
  boolean = 'boolean',
  text = 'text',
  number = 'number',
  array = 'array',
  list = 'list',
  group = 'group',
  textarea = 'textarea',
  select = 'select',
  separator = 'separator',
  radio = 'radio'
}

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

export interface RadialOption {
  label: string
  description: string
  value: string
  id: string
  title: string
}
