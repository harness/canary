import { get } from 'lodash-es'

import {
  getIsActionStep,
  getIsBackgroundStep,
  getIsRunStep,
  getIsRunTestStep,
  getIsTemplateStep
} from './common-step-utils'

const getNameOrScriptText = (stepData: string | Record<'script', string>, defaultString: string): string => {
  const isStepHasString = typeof stepData === 'string'

  return isStepHasString ? stepData : get(stepData, 'script', defaultString)
}

export const getNameBasedOnStep = (step: any, stepIndex: number): string => {
  if (step.name) return step.name

  let displayName = `Step ${stepIndex}`
  // Run
  if (getIsRunStep(step)) {
    displayName = getNameOrScriptText(step.run, 'Run')
  }
  // Run test
  else if (getIsRunTestStep(step)) {
    displayName = getNameOrScriptText(step?.['run-test'], 'Run Test')
  }
  // Background
  else if (getIsBackgroundStep(step)) {
    displayName = getNameOrScriptText(step?.background, 'Background')
  }
  // Action
  else if (getIsActionStep(step)) {
    displayName = get(step?.action, 'uses', 'GitHub Action')
  }
  // Template
  else if (getIsTemplateStep(step)) {
    displayName = get(step?.template, 'uses', 'Harness Template')
  }

  return displayName.split('\n')[0]
}
