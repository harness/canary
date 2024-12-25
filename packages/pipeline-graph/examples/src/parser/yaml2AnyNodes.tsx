import {
  AnyContainerNodeType,
  LeafContainerNodeType,
  ParallelContainerNodeType,
  SerialContainerNodeType
} from '../../../src/types/nodes'
import { ParallelGroupContentNodeDataType } from '../nodes/parallel-group-node'
import { StageNodeContentType } from '../nodes/stage-node'
import { StepNodeDataType } from '../nodes/step-node'
import { ContentNodeTypes } from '../types/content-node-types'
import { getIcon } from './utils'

export const yaml2Nodes = (
  yamlObject: Record<string, any>,
  options: { maxWidth?: number } = { maxWidth: 140 }
): AnyContainerNodeType[] => {
  const nodes: AnyContainerNodeType[] = []

  const stages = yamlObject?.pipeline?.stages
  if (stages) {
    const stagesNodes = processStages(stages, '', options)
    nodes.push(...stagesNodes)
  }

  return nodes
}

const getGroupKey = (stage: Record<string, any>): 'group' | 'parallel' | undefined => {
  if ('group' in stage) return 'group'
  else if ('parallel' in stage) return 'parallel'
  return undefined
}

const processStages = (stages: any[], currentPath: string, options: { maxWidth?: number }): AnyContainerNodeType[] => {
  return stages.map((stage, idx) => {
    // parallel stage
    const groupKey = getGroupKey(stage)
    if (groupKey === 'group') {
      const name = stage.name ?? `Serial group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140,
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,

        children: processStages(stage[groupKey].stages, path, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = stage.name ?? `Parallel group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140,
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processStages(stage[groupKey].stages, path, options)
      } satisfies ParallelContainerNodeType
    }
    // regular stage
    else {
      const name = stage.name ?? `Stage ${idx}`
      const path = `${currentPath}.${idx}`

      return {
        type: ContentNodeTypes.stage,
        config: {
          minWidth: 140,
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,
        children: processSteps(stage.steps, path, options)
      } satisfies SerialContainerNodeType
    }
  })
}

const processSteps = (steps: any[], currentPath: string, options: { maxWidth?: number }): AnyContainerNodeType[] => {
  return steps.map((step, idx) => {
    // parallel stage
    const groupKey = getGroupKey(step)
    if (groupKey === 'group') {
      const name = step.name ?? `Step group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140,
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,

        children: processSteps(step[groupKey].steps, path, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = step.name ?? `Parallel group ${idx}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140, // TMP
          hideDeleteButton: false,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processSteps(step[groupKey].steps, path, options)
      } satisfies ParallelContainerNodeType
    }
    // regular step
    else {
      const name = step.name ?? `Step ${idx}`

      const path = `${currentPath}.${idx}`
      return {
        type: ContentNodeTypes.step,
        config: {
          ...options,
          hideDeleteButton: false,
          selectable: true
        },
        data: {
          yamlPath: path,
          name,
          icon: getIcon(idx)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    }
  })
}
