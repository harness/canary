import type { ArrayInputConfig } from './ArrayInput'
import type { BooleanInputConfig } from './BooleanInput'
import type { GroupInputConfig } from './GroupInput'
import type { ListInputConfig } from './ListInput'
import type { NumberInputConfig } from './NumberInput'
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
  separator = 'separator'
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
