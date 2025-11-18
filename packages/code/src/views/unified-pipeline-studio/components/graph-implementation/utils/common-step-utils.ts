import { AnyNodeInternal } from '@harnessio/pipeline-graph'

import { YamlEntityType } from '../types/yaml-entity-type'

export const getIsRunStep = (step: Record<string, any>) => typeof step === 'object' && 'run' in step

export const getIsRunTestStep = (step: Record<string, any>) => typeof step === 'object' && 'run-test' in step

export const getIsBackgroundStep = (step: Record<string, any>) => typeof step === 'object' && 'background' in step

export const getIsActionStep = (step: Record<string, any>) => typeof step === 'object' && 'action' in step

export const getIsTemplateStep = (step: Record<string, any>) => typeof step === 'object' && 'template' in step

export const getNestedStepsCount = (children?: AnyNodeInternal[]): number => {
  let count = 0

  if (!children) return 0

  for (const child of children) {
    if (child.type === YamlEntityType.Step) {
      count += 1
    }

    if ('children' in child && Array.isArray(child.children)) {
      count += getNestedStepsCount(child.children)
    }
  }

  return count
}
