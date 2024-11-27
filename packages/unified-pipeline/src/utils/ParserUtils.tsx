import { get, has } from 'lodash-es'

import { Icon } from '@harnessio/canary'

import { Node } from '../components/Canvas/types'
import { StageCategory } from '../components/PipelineConfigPanel/types'
import { getIconBasedOnStep } from './stepUtils/stepIconUtil'
import { getNameBasedOnStep } from './stepUtils/stepNameUtil'
import { getIdFromName } from './StringUtils'

const STAGE_LABEL = 'Stage'
const STAGE_GROUP_LABEL = 'Stage Group'
const STEP_GROUP_LABEL = 'Step Group'
/* Prefixes */
const STAGES_PATH_PREFIX = 'stages'
export const PIPELINE_STAGES_PATH_PREFIX = `pipeline.${STAGES_PATH_PREFIX}`
export const STEPS_PATH_PREFIX = 'steps'
export const GROUP_PATH_PREFIX = 'group'
export const PARALLEL_PATH_PREFIX = 'parallel'

export const parsePipelineYaml = ({
  yamlObject,
  pathPrefix = '',
  isParallel = false
}: {
  yamlObject: string | Record<string, any>
  pathPrefix?: string
  isParallel?: boolean
}): Node[] => {
  const stages = get(yamlObject, pathPrefix, [])
  if (!Array.isArray(stages)) return []
  const collectedNodes: Node[] = []
  stages.forEach((stage, index) => {
    const category = has(stage, GROUP_PATH_PREFIX)
      ? StageCategory.GROUP
      : has(stage, PARALLEL_PATH_PREFIX)
        ? StageCategory.PARALLEL
        : StageCategory.UNIT

    const newPathPrefix = `${pathPrefix}.${index}`

    if (category === StageCategory.GROUP) {
      const groupMembers = parsePipelineYaml({
        yamlObject: get(stage, GROUP_PATH_PREFIX, []),
        pathPrefix: STAGES_PATH_PREFIX
      })
      collectedNodes.push(
        getGroupNode({
          group: stage,
          childNodes: groupMembers,
          groupIdx: index,
          groupNodePathPrefix: newPathPrefix,
          isStageGroup: true
        })
      )
    } else if (category === StageCategory.PARALLEL) {
      const parallelMembers = parsePipelineYaml({
        yamlObject: get(stage, PARALLEL_PATH_PREFIX, []),
        pathPrefix: STAGES_PATH_PREFIX,
        isParallel: true
      })
      collectedNodes.push(
        getGroupNode({
          group: stage,
          childNodes: parallelMembers,
          groupIdx: index,
          groupNodePathPrefix: newPathPrefix,
          isStageGroup: true
        })
      )
    } else {
      collectedNodes.push(
        getStageNode({
          stage,
          stageIdx: index,
          childNodes: getChildNodes(stage),
          stagePathPrefix: pathPrefix,
          isParallel
        })
      )
    }
  })
  return collectedNodes
}

const getGroupNode = ({
  group,
  childNodes,
  groupIdx,
  groupNodePathPrefix,
  isStageGroup
}: {
  group: Record<string, any>
  childNodes: Node[]
  groupIdx: number
  groupNodePathPrefix: string
  isStageGroup: boolean // if false - V0 yaml step group
}): Node => {
  const groupName = get(group, 'name', `${isStageGroup ? STAGE_GROUP_LABEL : STEP_GROUP_LABEL} ${groupIdx}`)
  const groupId = getIdFromName(groupName)
  return {
    name: groupName,
    path: groupNodePathPrefix,
    icon: null,
    children: childNodes,
    deletable: true,
    expandable: true,
    groupId: groupId
  } as Node
}

const getStageNode = ({
  stage,
  stageIdx,
  childNodes,
  stagePathPrefix,
  isParallel,
  isV0yaml = false
}: {
  stage: Record<string, any>
  stageIdx: number
  childNodes: Node[]
  stagePathPrefix: string
  isParallel?: boolean
  isV0yaml?: boolean
}): Node => {
  return {
    name: get(stage, isV0yaml ? 'stage.name' : 'name') || `${STAGE_LABEL} ${stageIdx}`,
    path: `${stagePathPrefix}.${stageIdx}`,
    icon: null,
    children: childNodes,
    deletable: true,
    expandable: true,
    ...(isParallel && { parallel: isParallel })
  } as Node
}

const getChildNodes = (stage: Record<string, any>): Node[] => {
  const steps = get(stage, STEPS_PATH_PREFIX, [])
  let childNodes: Node[] = []
  if (Array.isArray(steps) && steps.length > 0) {
    childNodes = steps.map((step: Record<string, any>, stepIndex: number) => getStepNode(step, stepIndex))
  }
  return childNodes
}

function getIconAndDisplayName(step: Record<string, any>, stepIndex: number, _?: boolean) {
  return {
    name: step?.name || getNameBasedOnStep(step, stepIndex),
    icon: (
      <div className="node-icon">
        <Icon name={getIconBasedOnStep(step)} />
      </div>
    )
  }
}

const getStepNode = (step: Record<string, any>, stepIndex: number, isV0yaml?: boolean, isParallel?: boolean): Node => {
  return {
    ...getIconAndDisplayName(step, stepIndex, isV0yaml),
    expandable: false,
    path: '',
    deletable: false,
    ...(isParallel && { parallel: isParallel })
  } as Node
}

/* Parser Utils for V0 pipeline yaml */

const V0_STEPS_PATH_PREFIX = 'stage.spec.execution.steps'

export const parseV0PipelineYaml = ({
  yamlObject,
  pathPrefix = '',
  isParallel = false
}: {
  yamlObject: string | Record<string, any>
  pathPrefix?: string
  isParallel?: boolean
}): Node[] => {
  const stages = pathPrefix.length ? get(yamlObject, pathPrefix, []) : yamlObject
  if (!Array.isArray(stages)) return []
  const collectedNodes: Node[] = []

  stages.forEach((stage, index) => {
    const category = has(stage, PARALLEL_PATH_PREFIX) ? StageCategory.PARALLEL : StageCategory.UNIT

    if (category === StageCategory.PARALLEL) {
      const newPathPrefix = pathPrefix.length ? `${pathPrefix}.${index}` : `${index}`
      const parallelMembers = parseV0PipelineYaml({
        yamlObject: get(stage, PARALLEL_PATH_PREFIX, []),
        pathPrefix: '',
        isParallel: true
      })
      collectedNodes.push(
        getGroupNode({
          group: stage,
          childNodes: parallelMembers,
          groupIdx: index,
          groupNodePathPrefix: newPathPrefix,
          isStageGroup: true
        })
      )
    } else {
      // now this is a standalone stage with some steps
      collectedNodes.push(
        getStageNode({
          stage,
          stageIdx: index,
          childNodes: getChildNodesOfV0Stage(stage),
          stagePathPrefix: pathPrefix,
          isParallel,
          isV0yaml: true
        })
      )
    }
  })
  return collectedNodes
}

const getChildNodesOfV0Stage = (stage: Record<string, any>): Node[] => {
  const steps = get(stage, V0_STEPS_PATH_PREFIX, [])
  const childNodes: Node[] = []
  if (Array.isArray(steps) && steps.length > 0) {
    steps.forEach((stepOrParallel: Record<string, any>, stepIndex: number) => {
      if (has(stepOrParallel, PARALLEL_PATH_PREFIX)) {
        const parallelNodes = parseV0ParallelSteps({
          yamlObject: stepOrParallel,
          pathPrefix: PARALLEL_PATH_PREFIX,
          isParallel: true
        })
        childNodes.push(
          getGroupNode({
            group: stepOrParallel,
            childNodes: parallelNodes,
            groupIdx: stepIndex,
            groupNodePathPrefix: `${V0_STEPS_PATH_PREFIX}.${stepIndex}`,
            isStageGroup: false
          })
        )
      } else {
        childNodes.push(getStepNode(stepOrParallel, stepIndex, true))
      }
    })
  }
  return childNodes
}

export const parseV0ParallelSteps = ({
  yamlObject,
  isParallel = false
}: {
  yamlObject: string | Record<string, any>
  pathPrefix?: string
  isParallel?: boolean
}): Node[] => {
  const childNodes: Node[] = []
  const steps = get(yamlObject, PARALLEL_PATH_PREFIX, [])
  if (Array.isArray(steps) && steps.length > 0) {
    steps.forEach((step: Record<string, any>, stepIndex: number) => {
      childNodes.push(getStepNode(step, stepIndex, true, isParallel))
    })
  }
  return childNodes
}
