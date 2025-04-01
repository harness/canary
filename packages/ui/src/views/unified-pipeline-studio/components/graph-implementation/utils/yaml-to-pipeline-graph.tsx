import { parse } from 'yaml'

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

export interface Yaml2PipelineGraphOptions {
  getStepIcon?: (step: Record<string, any>) => JSX.Element
  getName?: (entityType: YamlEntityType, data: Record<string, any>, idx: number) => string
}

export const yamlString2Nodes = (yaml: string, options: Yaml2PipelineGraphOptions = {}) => {
  const yamlJson = parse(yaml)
  return yaml2Nodes(yamlJson, options)
}

export const processGithubJobsToStages = (yamlJson: Record<string, any>) => {
  if (yamlJson.jobs) {
    yamlJson.pipeline = yamlJson.pipeline || {}
    yamlJson.pipeline.stages = yamlJson.pipeline.stages || []

    Object.entries(yamlJson.jobs).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        yamlJson.pipeline.stages.push({ ...value, id: key, name: key })
      }
    })

    delete yamlJson.jobs
    return yamlJson
  }
  return yamlJson
}

export const yaml2Nodes = (
  yamlObject: Record<string, any>,
  options: Yaml2PipelineGraphOptions = {}
): AnyContainerNodeType[] => {
  const nodes: AnyContainerNodeType[] = []
  const processedYamlObject = processGithubJobsToStages(yamlObject)
  const stages = processedYamlObject?.pipeline?.stages ?? []

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
  options: Yaml2PipelineGraphOptions
): AnyContainerNodeType[] => {
  return stages.map((stage, idx) => {
    // parallel stage
    const groupKey = getGroupKey(stage)
    if (groupKey === 'group') {
      const name = options.getName?.(YamlEntityType.SerialStageGroup, stage, idx) ?? stage.name
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.stages`

      return {
        type: ContentNodeType.SerialStageGroup,
        config: {
          minWidth: 200,
          minHeight: 50,
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
      const name = options.getName?.(YamlEntityType.ParallelStageGroup, stage, idx) ?? stage.name
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.stages`

      return {
        type: ContentNodeType.ParallelStageGroup,
        config: {
          minWidth: 200,
          minHeight: 50,
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
      const name = options.getName?.(YamlEntityType.Stage, stage, idx) ?? stage.name
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.steps`

      return {
        type: ContentNodeType.Stage,
        config: {
          minWidth: 200,
          minHeight: 50,
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
  options: Yaml2PipelineGraphOptions
): AnyContainerNodeType[] => {
  return steps.map((step, idx) => {
    // parallel stage
    const groupKey = getGroupKey(step)
    if (groupKey === 'group') {
      const name = options.getName?.(YamlEntityType.SerialStepGroup, step, idx) ?? step.name
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.steps`

      return {
        type: ContentNodeType.SerialStepGroup,
        config: {
          minWidth: 200,
          minHeight: 50,
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
      const name = options.getName?.(YamlEntityType.ParallelStepGroup, step, idx) ?? step.name
      const path = `${currentPath}.${idx}`
      const childrenPath = `${path}.${groupKey}.steps`

      return {
        type: ContentNodeType.ParallelStepGroup,
        config: {
          minWidth: 200,
          minHeight: 50,
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
      const name = options.getName?.(YamlEntityType.Step, step, idx) ?? getNameBasedOnStep(step, idx + 1)
      const path = `${currentPath}.${idx}`

      return {
        type: ContentNodeType.Step,
        config: {
          maxWidth: 200,
          minHeight: 50,
          width: 200,
          hideDeleteButton: false,
          selectable: true
        },
        data: {
          yamlPath: path,
          yamlEntityType: YamlEntityType.Step,
          name,
          icon: options.getStepIcon?.(step) ?? getIconBasedOnStep(step)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    }
  })
}
