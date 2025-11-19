import { AnyNodeInternal } from '@harnessio/pipeline-graph'

export enum YamlEntityType {
  Step = 'Step',
  Stage = 'Stage',
  ParallelStageGroup = 'ParallelStageGroup',
  SerialStageGroup = 'SerialStageGroup',
  SerialStepGroup = 'SerialStepGroup',
  ParallelStepGroup = 'ParallelStepGroup'
}

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
