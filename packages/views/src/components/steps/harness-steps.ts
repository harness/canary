import { ACTION_STEP_DESCRIPTION, actionStepFormDefinition } from './action-step'
import { APPROVAL_STEP_DESCRIPTION, approvalStepFormDefinition } from './approval-step'
import { BACKGROUND_STEP_DESCRIPTION, backgroundStepFormDefinition } from './background-step'
import { BARRIER_STEP_DESCRIPTION, barrierStepFormDefinition } from './barrier-step'
import { GROUP_DESCRIPTION, groupFormDefinition } from './group'
import { PARALLEL_DESCRIPTION, parallelFormDefinition } from './parallel'
import { QUEUE_STEP_DESCRIPTION, queueStepFormDefinition } from './queue-step'
import { RUN_STEP_DESCRIPTION, runStepFormDefinition } from './run-step'
import { RUN_TEST_STEP_DESCRIPTION, runTestStepFormDefinition } from './run-test-step'
import {
  ACTION_STEP_IDENTIFIER,
  APPROVAL_STEP_IDENTIFIER,
  BACKGROUND_STEP_IDENTIFIER,
  BARRIER_STEP_IDENTIFIER,
  GROUP_IDENTIFIER,
  HARNESS_STEP_GROUP_IDENTIFIER,
  HARNESS_STEP_IDENTIFIER,
  HarnessStep,
  HarnessStepGroup,
  PARALLEL_IDENTIFIER,
  QUEUE_STEP_IDENTIFIER,
  RUN_STEP_IDENTIFIER,
  RUN_TEST_STEP_IDENTIFIER
} from './types'

export const harnessSteps: (HarnessStep | HarnessStepGroup)[] = [
  {
    identifier: RUN_STEP_IDENTIFIER,
    description: RUN_STEP_DESCRIPTION,
    formDefinition: runStepFormDefinition
  },
  {
    identifier: RUN_TEST_STEP_IDENTIFIER,
    description: RUN_TEST_STEP_DESCRIPTION,
    formDefinition: runTestStepFormDefinition
  },
  {
    identifier: QUEUE_STEP_IDENTIFIER,
    description: QUEUE_STEP_DESCRIPTION,
    formDefinition: queueStepFormDefinition
  },
  {
    identifier: BACKGROUND_STEP_IDENTIFIER,
    description: BACKGROUND_STEP_DESCRIPTION,
    formDefinition: backgroundStepFormDefinition
  },
  {
    identifier: APPROVAL_STEP_IDENTIFIER,
    description: APPROVAL_STEP_DESCRIPTION,
    formDefinition: approvalStepFormDefinition
  },
  {
    identifier: BARRIER_STEP_IDENTIFIER,
    description: BARRIER_STEP_DESCRIPTION,
    formDefinition: barrierStepFormDefinition
  },
  {
    identifier: ACTION_STEP_IDENTIFIER,
    description: ACTION_STEP_DESCRIPTION,
    formDefinition: actionStepFormDefinition
  },
  {
    identifier: GROUP_IDENTIFIER,
    description: GROUP_DESCRIPTION,
    formDefinition: groupFormDefinition
  },
  {
    identifier: PARALLEL_IDENTIFIER,
    description: PARALLEL_DESCRIPTION,
    formDefinition: parallelFormDefinition
  }
]

export const harnessStepGroups: HarnessStepGroup[] = [
  {
    identifier: GROUP_IDENTIFIER,
    description: GROUP_DESCRIPTION,
    formDefinition: groupFormDefinition
  },
  {
    identifier: PARALLEL_IDENTIFIER,
    description: PARALLEL_DESCRIPTION,
    formDefinition: parallelFormDefinition
  }
]

export function getHarnessStepIdentifier(step: {
  identifier: string
}): HARNESS_STEP_IDENTIFIER | HARNESS_STEP_GROUP_IDENTIFIER | undefined {
  return harnessSteps.find(harnessStep => harnessStep.identifier in step)?.identifier
}

export function getHarnessStepDefinition(identifier: string): HarnessStep | undefined {
  return harnessSteps.find(harnessStep => harnessStep.identifier === identifier)
}
