import { YamlEntityType } from '@harnessio/ui/types'

// Re-export getNestedStepsCount from pipeline-nodes utils
export { getNestedStepsCount } from '../../../../pipeline-nodes/utils/pipeline-utils'

export const getIsRunStep = (step: Record<string, any>) => typeof step === 'object' && 'run' in step

export const getIsRunTestStep = (step: Record<string, any>) => typeof step === 'object' && 'run-test' in step

export const getIsBackgroundStep = (step: Record<string, any>) => typeof step === 'object' && 'background' in step

export const getIsActionStep = (step: Record<string, any>) => typeof step === 'object' && 'action' in step

export const getIsTemplateStep = (step: Record<string, any>) => typeof step === 'object' && 'template' in step
