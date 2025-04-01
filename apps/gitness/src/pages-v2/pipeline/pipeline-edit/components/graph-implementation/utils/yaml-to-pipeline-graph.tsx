import {
  AnyContainerNodeType,
  LeafContainerNodeType,
  ParallelContainerNodeType,
  SerialContainerNodeType
} from '@harnessio/pipeline-graph'
import { Icon } from '@harnessio/ui/components'

import { ContentNodeTypes } from '../content-node-types'
import { ParallelGroupContentNodeDataType } from '../nodes/parallel-group-node'
import { StageContentNodeDataType } from '../nodes/stage-node'
import { StepNodeDataType } from '../nodes/step-node'
import { YamlEntityType } from '../types/nodes'
import { getIconBasedOnStep } from './step-icon-utils'
import { getNameBasedOnStep } from './step-name-utils'

export const yaml2Nodes = (
  yamlObject: Record<string, any>,
  options: { selectedPath?: string } = {}
): AnyContainerNodeType[] => {
  const nodes: AnyContainerNodeType[] = []

  const stages = yamlObject?.pipeline?.stages ?? []

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

const processStages = (
  stages: any[],
  currentPath: string,
  options: { selectedPath?: string }
): AnyContainerNodeType[] => {
  return stages.map((stage, idx) => {
    // parallel stage
    const groupKey = getGroupKey(stage)
    if (groupKey === 'group') {
      const name = stage.name ?? `Serial ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 192,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.SerialGroup,
          name
        } satisfies StageContentNodeDataType,
        children: processStages(stage[groupKey].stages, childrenPath, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = stage.name ?? `Parallel ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.stages`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 192,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.ParallelGroup,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processStages(stage[groupKey].stages, childrenPath, options)
      } satisfies ParallelContainerNodeType
    }
    // regular stage
    else {
      const name = stage.name ?? `Stage ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.steps`

      return {
        type: ContentNodeTypes.stage,
        config: {
          minWidth: 192,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.Stage,
          name
        } satisfies StageContentNodeDataType,
        children: processSteps(stage.steps, childrenPath, options)
      } satisfies SerialContainerNodeType
    }
  })
}

const processSteps = (
  steps: any[],
  currentPath: string,
  options: { selectedPath?: string }
): AnyContainerNodeType[] => {
  return steps.map((step, idx) => {
    // parallel stage
    const groupKey = getGroupKey(step)
    if (groupKey === 'group') {
      const name = step.name ?? `Serial steps ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.serial,
        config: {
          minWidth: 192,
          hideDeleteButton: true,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.StepSerialGroup,
          name
        } satisfies StageContentNodeDataType,

        children: processSteps(step[groupKey].steps, childrenPath, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = step.name ?? `Parallel steps ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.steps`

      return {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 192,
          hideDeleteButton: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.StepParallelGroup,
          name
        } satisfies ParallelGroupContentNodeDataType,
        children: processSteps(step[groupKey].steps, childrenPath, options)
      } satisfies ParallelContainerNodeType
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
          yamlEntityType: YamlEntityType.Step,
          name,
          icon: <Icon className="m-2 size-8" name={getIconBasedOnStep(step)} />,
          selected: path === options?.selectedPath
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    }
  })
}
