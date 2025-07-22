import { ArrayInputConfig } from '../array-input'
import { CheckboxInputConfig } from '../checkbox-input'
import { GroupInputConfig } from '../group-input'
import { IntegerInputConfig } from '../integer-input'
import { ListInputConfig } from '../list-input'
import { SelectInputConfig } from '../select-input'
import { TextInputConfig } from '../text-input'

export enum InputType {
  text = 'text',
  checkbox = 'checkbox',
  integer = 'integer',
  select = 'select',
  array = 'array',
  list = 'list',
  group = 'group'
}

export type InputConfigType =
  | TextInputConfig
  | IntegerInputConfig
  | CheckboxInputConfig
  | ArrayInputConfig
  | SelectInputConfig
  | ListInputConfig
  | GroupInputConfig
