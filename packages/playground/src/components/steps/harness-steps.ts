import { ACTION_STEP_DESCRIPTION, actionStepFormDefinition } from './action-step'
import { APPROVAL_STEP_DESCRIPTION, approvalStepFormDefinition } from './approval-step'
import { BACKGROUND_STEP_DESCRIPTION, backgroundStepFormDefinition } from './background-step'
import { BARRIER_STEP_DESCRIPTION, barrierStepFormDefinition } from './barrier-step'
import { QUEUE_STEP_DESCRIPTION, queueStepFormDefinition } from './queue-step'
import { RUN_STEP_DESCRIPTION, runStepFormDefinition } from './run-step'
import { RUN_TEST_STEP_DESCRIPTION, runTestStepFormDefinition } from './run-test-step'
import {
  ACTION_STEP_IDENTIFIER,
  APPROVAL_STEP_IDENTIFIER,
  BACKGROUND_STEP_IDENTIFIER,
  BARRIER_STEP_IDENTIFIER,
  GROUP_IDENTIFIER,
  PARALLEL_IDENTIFIER,
  QUEUE_STEP_IDENTIFIER,
  RUN_STEP_IDENTIFIER,
  RUN_TEST_STEP_IDENTIFIER,
  type HARNESS_STEP_IDENTIFIER,
  type HarnessStep,
  type HarnessStepGroup
} from './types'

export const harnessSteps: HarnessStep[] = [
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
  }
]

export interface StepQueue {
  key: string
  scope?: 'pipeline' | 'stage'
}

export const harnessStepGroups: HarnessStepGroup[] = [
  {
    identifier: GROUP_IDENTIFIER,
    description: 'Add serial steps group.'
  },
  {
    identifier: PARALLEL_IDENTIFIER,
    description: 'Add parallel steps group.'
  }
]

export function isHarnessStep(step: Record<string, unknown>): boolean {
  const harnessStepsIds = harnessSteps.map(step => step.identifier)
  return harnessStepsIds.some(stepId => stepId in step)
}

export function isHarnessGroup(step: { identifier: string }): boolean {
  const harnessStepsIds = harnessStepGroups.map(step => step.identifier)
  return harnessStepsIds.some(stepId => stepId in step)
}

export function getHarnessStepIdentifier(step: { identifier: string }): HARNESS_STEP_IDENTIFIER | undefined {
  return harnessSteps.find(harnessStep => harnessStep.identifier in step)?.identifier
}

export function getHarnessStepDefinition(identifier: string): HarnessStep | undefined {
  return harnessSteps.find(harnessStep => harnessStep.identifier === identifier)
}
