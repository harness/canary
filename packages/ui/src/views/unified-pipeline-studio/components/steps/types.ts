import { IFormDefinition, IInputDefinition } from '@harnessio/forms'

import { InputConfigType } from '../form-inputs/types'

// type for form definition
export type IInputConfigWithConfig = IInputDefinition & InputConfigType

export const RUN_STEP_IDENTIFIER = 'run'
export const RUN_TEST_STEP_IDENTIFIER = 'run-test'
export const QUEUE_STEP_IDENTIFIER = 'queue'
export const BACKGROUND_STEP_IDENTIFIER = 'background'
export const APPROVAL_STEP_IDENTIFIER = 'approval'
export const BARRIER_STEP_IDENTIFIER = 'barrier'
export const ACTION_STEP_IDENTIFIER = 'action'

export const TEMPLATE_STEP_IDENTIFIER = 'template'

export const GROUP_IDENTIFIER = 'group'
export const PARALLEL_IDENTIFIER = 'parallel'

export type HARNESS_STEP_IDENTIFIER =
  | typeof RUN_STEP_IDENTIFIER
  | typeof RUN_TEST_STEP_IDENTIFIER
  | typeof QUEUE_STEP_IDENTIFIER
  | typeof BACKGROUND_STEP_IDENTIFIER
  | typeof APPROVAL_STEP_IDENTIFIER
  | typeof BARRIER_STEP_IDENTIFIER
  | typeof ACTION_STEP_IDENTIFIER
export type HARNESS_STEP_GROUP_IDENTIFIER = typeof GROUP_IDENTIFIER | typeof PARALLEL_IDENTIFIER
export type HARNESS_STEP_AND_STEP_GROUP_IDENTIFIER = HARNESS_STEP_IDENTIFIER | HARNESS_STEP_GROUP_IDENTIFIER

export type AnyStepDefinition<T = string, M = InputConfigType> = {
  identifier: T
  description: string
  formDefinition: IFormDefinition<M>
}

export type HarnessStepDefinitionType = AnyStepDefinition<HARNESS_STEP_IDENTIFIER>
export type HarnessStepGroupDefinitionType = AnyStepDefinition<HARNESS_STEP_GROUP_IDENTIFIER>
