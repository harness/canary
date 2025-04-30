import type { ArrayInputConfig } from './ArrayInput'
import type { BooleanInputConfig } from './BooleanInput'
import { CalendarInputConfig } from './calendar-form-input'
import type { GroupInputConfig } from './GroupInput'
import type { ListInputConfig } from './ListInput'
import type { NumberInputConfig } from './NumberInput'
import type { RadialInputConfig } from './RadialInput'
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
  | 'calendar'

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
  | CalendarInputConfig

export interface RadioOption {
  label: string
  description: string
  value: string
  id: string
  title: string
}
