import { Icon } from '@harnessio/canary'
import { AnyNodeType, LeafNodeType, ParallelNodeType, SerialNodeType } from '@harnessio/pipeline-graph'

import { ContentNodeTypes } from '../content-node-types'
import { ParallelGroupContentNodeDataType } from '../nodes/parallel-group-node'
import { StageNodeContentType } from '../nodes/stage-node'
import { StepNodeDataType } from '../nodes/step-node'
import { getIconBasedOnStep } from './step-icon-utils'
import { getNameBasedOnStep } from './step-name-utils'

export const yaml2Nodes = (yamlObject: Record<string, any>, options: { selectedPath?: string } = {}): AnyNodeType[] => {
  const nodes: AnyNodeType[] = []

  const stages = yamlObject?.pipeline?.stages

  if (stages) {
    const stagesNodes = processStages(stages, 'pipeline.stages', options)
    nodes.push(...stagesNodes)
  }

  return nodes
}

const getGroupKey = (stage: Record<string, any>): 'group' | 'parallel' | undefined => {
  if ('group' in stage) return 'group'
  else if ('parallel' in stage) return 'parallel'
  return undefined
}

const processStages = (stages: any[], currentPath: string, options: { selectedPath?: string }): AnyNodeType[] => {
  return stages.map((stage, idx) => {
    // parallel stage
    const groupKey = getGroupKey(stage)
    if (groupKey === 'group') {
      const name = stage.name ?? `Serial ${idx + 1}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,
        children: processStages(stage[groupKey].stages, path, options)
      } satisfies SerialNodeType
    } else if (groupKey === 'parallel') {
      const name = stage.name ?? `Parallel ${idx + 1}`
      const path = `${currentPath}.${idx}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processStages(stage[groupKey].stages, path, options)
      } satisfies ParallelNodeType
    }
    // regular stage
    else {
      const name = stage.name ?? `Stage ${idx + 1}`
      const path = `${currentPath}.${idx}.steps`

      return {
        type: ContentNodeTypes.stage,
        config: {
          minWidth: 140,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,
        children: processSteps(stage.steps, path, options)
      } satisfies SerialNodeType
    }
  })
}

const processSteps = (steps: any[], currentPath: string, options: { selectedPath?: string }): AnyNodeType[] => {
  return steps.map((step, idx) => {
    // parallel stage
    const groupKey = getGroupKey(step)
    if (groupKey === 'group') {
      const name = step.name ?? `Serial steps ${idx + 1}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 140,
          hideDeleteButton: true,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          name
        } satisfies StageNodeContentType,

        children: processSteps(step[groupKey].steps, path, options)
      } satisfies SerialNodeType
    } else if (groupKey === 'parallel') {
      const name = step.name ?? `Parallel steps ${idx + 1}`
      const path = `${currentPath}.${idx}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140,
          hideDeleteButton: true
        },
        data: {
          yamlPath: path,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processSteps(step[groupKey].steps, path, options)
      } satisfies ParallelNodeType
    }
    // regular step
    else {
      const name = getNameBasedOnStep(step, idx + 1)
      const path = `${currentPath}.${idx}`

      return {
        type: ContentNodeTypes.step,
        config: {
          maxWidth: 140,
          width: 140,
          hideDeleteButton: false,
          selectable: true
        },
        data: {
          yamlPath: path,
          name,
          icon: <Icon className="m-2 size-8" name={getIconBasedOnStep(step)} />,
          selected: path === options?.selectedPath
        } satisfies StepNodeDataType
      } satisfies LeafNodeType
    }
  })
}
