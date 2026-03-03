import {
  AccordionFormInputConfig,
  AccordionFormInputDefinition
} from '../canary-inputs/accordion-form-input/accordion-form-input-types'
import { BooleanFormInputConfig } from '../canary-inputs/boolean-form-input/boolean-form-input-types'
import {
  GroupFormInputConfig,
  GroupFormInputDefinition
} from '../canary-inputs/group-form-input/group-form-input-types'
import { ListFormInputConfig } from '../canary-inputs/list-form-input/list-form-input-types'
import { NumberFormInputConfig } from '../canary-inputs/number-form-input/number-form-input-types'
import { SelectFormInputConfig } from '../canary-inputs/select-form-input/select-form-input-types'
import { TextFormInputConfig, TextFormInputDefinition } from '../canary-inputs/text-form-input/text-form-input-types'

export type AllInputsDefinition = TextFormInputDefinition | GroupFormInputDefinition | AccordionFormInputDefinition

export enum InputType {
  text = 'text',
  boolean = 'boolean',
  number = 'number',
  select = 'select',
  array = 'array',
  list = 'list',
  group = 'group',
  slot = 'slot'
}

export type InputConfigType =
  | TextFormInputConfig
  | GroupFormInputConfig
  | AccordionFormInputConfig
  | BooleanFormInputConfig
  | NumberFormInputConfig
  | SelectFormInputConfig
  | ArrayFormInputConfig
  | ListFormInputConfig
