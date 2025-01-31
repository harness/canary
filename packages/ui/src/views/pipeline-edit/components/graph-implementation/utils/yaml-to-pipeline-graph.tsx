import { Icon } from '@components/icon'

import {
  AnyContainerNodeType,
  LeafContainerNodeType,
  ParallelContainerNodeType,
  SerialContainerNodeType
} from '@harnessio/pipeline-graph'

import { ParallelStageGroupContentNodeDataType } from '../nodes/parallel-stage-group-content-node'
import { ParallelStepGroupContentNodeDataType } from '../nodes/parallel-step-group-content-node'
import { SerialStageGroupContentNodeDataType } from '../nodes/serial-stage-group-content-node'
import { SerialStepGroupContentNodeDataType } from '../nodes/serial-step-group-content-node'
import { StageContentNodeDataType } from '../nodes/stage-content-node'
import { StepNodeDataType } from '../nodes/step-content-node'
import { ContentNodeType } from '../types/content-node-type'
import { YamlEntityType } from '../types/yaml-entity-type'
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
        type: ContentNodeType.SerialStageGroup,
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.SerialStageGroup,
          name
        } satisfies SerialStageGroupContentNodeDataType,
        children: processStages(stage[groupKey].stages, childrenPath, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = stage.name ?? `Parallel ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.stages`

      return {
        type: ContentNodeType.ParallelStageGroup,
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true,
          hideBeforeAdd: true,
          hideAfterAdd: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.ParallelStageGroup,
          name
        } satisfies ParallelStageGroupContentNodeDataType,
        children: processStages(stage[groupKey].stages, childrenPath, options)
      } satisfies ParallelContainerNodeType
    }
    // regular stage
    else {
      const name = stage.name ?? `Stage ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.steps`

      return {
        type: ContentNodeType.Stage,
        config: {
          minWidth: 192,
          minHeight: 40,
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
        type: ContentNodeType.SerialStepGroup,
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true,
          hideCollapseButton: false
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.SerialStepGroup,
          name
        } satisfies SerialStepGroupContentNodeDataType,
        children: processSteps(step[groupKey].steps, childrenPath, options)
      } satisfies SerialContainerNodeType
    } else if (groupKey === 'parallel') {
      const name = step.name ?? `Parallel steps ${idx + 1}`
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.steps`

      return {
        type: ContentNodeType.ParallelStepGroup,
        config: {
          minWidth: 192,
          minHeight: 40,
          hideDeleteButton: true
        },
        data: {
          yamlPath: path,
          yamlChildrenPath: childrenPath,
          yamlEntityType: YamlEntityType.ParallelStepGroup,
          name
        } satisfies ParallelStepGroupContentNodeDataType,
        children: processSteps(step[groupKey].steps, childrenPath, options)
      } satisfies ParallelContainerNodeType
    }
    // regular step
    else {
      const name = getNameBasedOnStep(step, idx + 1)
      const path = `${currentPath}.${idx}`

      return {
        type: ContentNodeType.Step,
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
