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
  AnyStepDefinition,
  APPROVAL_STEP_IDENTIFIER,
  BACKGROUND_STEP_IDENTIFIER,
  BARRIER_STEP_IDENTIFIER,
  GROUP_IDENTIFIER,
  HARNESS_STEP_GROUP_IDENTIFIER,
  HARNESS_STEP_IDENTIFIER,
  HarnessStepDefinitionType,
  HarnessStepGroupDefinitionType,
  PARALLEL_IDENTIFIER,
  QUEUE_STEP_IDENTIFIER,
  RUN_STEP_IDENTIFIER,
  RUN_TEST_STEP_IDENTIFIER
} from './types'

export const harnessSteps: (HarnessStepDefinitionType | HarnessStepGroupDefinitionType)[] = [
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

export interface StepQueue {
  key: string
  scope?: 'pipeline' | 'stage'
}

export const harnessStepGroups: HarnessStepGroupDefinitionType[] = [
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

export function isHarnessStep(step: Record<string, unknown>): boolean {
  const harnessStepsIds = harnessSteps.map(step => step.identifier)
  return harnessStepsIds.some(stepId => stepId in step)
}

export function isHarnessGroup(step: Record<string, unknown>): boolean {
  const harnessStepsIds = harnessStepGroups.map(step => step.identifier)
  return harnessStepsIds.some(stepId => stepId in step)
}

export function getHarnessSteOrGroupIdentifier(step: {
  identifier: string
}): HARNESS_STEP_IDENTIFIER | HARNESS_STEP_GROUP_IDENTIFIER | undefined {
  return harnessSteps.find(harnessStep => harnessStep.identifier in step)?.identifier
}

export function getHarnessStepOrGroupDefinition(
  identifier: string,
  preferredStepsDefinitions?: AnyStepDefinition[]
): HarnessStepDefinitionType | HarnessStepGroupDefinitionType | undefined {
  const stepDef = preferredStepsDefinitions?.find(harnessStep => harnessStep.identifier === identifier)
  if (stepDef) {
    return stepDef as HarnessStepDefinitionType
  }

  return harnessSteps.find(harnessStep => harnessStep.identifier === identifier)
}
