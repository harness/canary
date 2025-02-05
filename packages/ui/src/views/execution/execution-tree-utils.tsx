import { TreeViewElement } from '@/components'
import { CiStatus } from '@views/pipelines'
import { ExecutionState } from '@views/repo/pull-request'

import { getFormattedDuration } from '../../utils/TimeUtils'
import { Execution, Stage, Step } from './types'

const mapCiStatusToExecutionState = (status: CiStatus): ExecutionState => {
  switch (status) {
    case 'blocked':
      return ExecutionState.BLOCKED
    case 'declined':
    case 'failure':
      return ExecutionState.FAILURE
    case 'error':
      return ExecutionState.ERROR
    case 'killed':
      return ExecutionState.KILLED
    case 'pending':
      return ExecutionState.PENDING
    case 'running':
      return ExecutionState.RUNNING
    case 'skipped':
      return ExecutionState.SKIPPED
    case 'success':
      return ExecutionState.SUCCESS
    case 'waiting_on_dependencies':
      return ExecutionState.WAITING_ON_DEPENDENCIES
    default:
      return ExecutionState.UNKNOWN
  }
}

const getStageId = (stageNum: number) => `stage.${stageNum}`

export const getStepId = (stageNum: number, stepNum: number) => `${getStageId(stageNum)}.step.${stepNum}`

export const parseStageStepId = (fullStepId: string): { stageId: string; stepId: string | null } | undefined => {
  const stageStepPattern = /^stage\.(\d+)(?:\.step\.(\d+))?$/
  const match = fullStepId.match(stageStepPattern)
  if (match) {
    const stageId = match[1]
    const stepId = match[2] || null
    return { stageId, stepId }
  }
}

// Recursively convert a step to TreeViewElement format
const convertStepToTree = ({ stage, step }: { stage: Stage; step: Step }): TreeViewElement => {
  return {
    id: getStepId(stage.number ?? 0, step.number ?? 0),
    isSelectable: true,
    name: step.name ?? '',
    status: mapCiStatusToExecutionState(step.status as CiStatus),
    duration: getFormattedDuration(step.started, step.stopped),
    children: []
  }
}

// Convert a stage to TreeViewElement format
const convertStageToTree = (stage: Stage): TreeViewElement => {
  return {
    id: getStageId(stage.number ?? 0),
    isSelectable: true,
    name: stage.name ?? '',
    status: mapCiStatusToExecutionState(stage.status as CiStatus),
    duration: getFormattedDuration(stage.started, stage.stopped),
    children: stage.steps ? stage.steps.map(step => convertStepToTree({ stage, step })) : []
  }
}

export const convertExecutionToTree = (execution: Execution): TreeViewElement[] => {
  if (!execution || !execution.stages) return []
  return execution.stages.map(stage => convertStageToTree(stage))
}
