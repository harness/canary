import type { ArrayFormInputConfig } from './array-input'
import type { BooleanFormInputConfig } from './boolean-form-input'
import type { CalendarInputConfig } from './calendar-form-input'
import type { CardsFormInputConfig } from './cards-form-input'
import type { GroupFormInputConfig } from './group-form-input'
import type { ListFormInputConfig } from './list-form-input'
import type { NumberFormInputConfig } from './number-form-input'
import type { SelectFormInputConfig } from './select-form-input'
import type { TextFormInputConfig } from './text-form-input'
import type { TextareaFormInputConfig } from './textarea-form-input'

export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'array'
  | 'list'
  | 'group'
  | 'select'
  | 'separator'
  | 'cards'
  | 'calendar'
  | 'secretSelect'

export type InputConfigType =
  | TextFormInputConfig
  | TextareaFormInputConfig
  | NumberFormInputConfig
  | BooleanFormInputConfig
  | ArrayFormInputConfig
  | ListFormInputConfig
  | GroupFormInputConfig
  | SelectFormInputConfig
  | CardsFormInputConfig
  | CalendarInputConfig
