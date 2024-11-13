import { TreeViewElement, Status } from '@harnessio/canary'
import { CiStatus, ExecutionState } from '../execution/types'
import { getFormattedDuration } from '../../utils/TimeUtils'

interface Step {
  number?: number
  name?: string
  status?: CiStatus
  started?: number
  stopped?: number
}

interface Stage {
  number?: number
  name?: string
  status?: CiStatus
  started?: number
  stopped?: number
  steps?: Step[]
}

interface Execution {
  stages?: Stage[]
}

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

const mapStatus = (status: ExecutionState): Status => {
  switch (status) {
    case ExecutionState.RUNNING:
      return Status.IN_PROGRESS
    case ExecutionState.SUCCESS:
      return Status.SUCCESS
    case ExecutionState.ERROR:
    case ExecutionState.FAILURE:
    case ExecutionState.KILLED:
      return Status.FAILED
    case ExecutionState.PENDING:
    case ExecutionState.BLOCKED:
      return Status.QUEUED
    case ExecutionState.SKIPPED:
      return Status.SKIPPED
    case ExecutionState.WAITING_ON_DEPENDENCIES:
      return Status.WAITING_ON_DEPENDENCIES
    default:
      return Status.UNKNOWN
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
  const executionState = mapCiStatusToExecutionState(step.status ?? ExecutionState.ERROR)
  return {
    id: getStepId(stage.number ?? 0, step.number ?? 0),
    isSelectable: true,
    name: step.name ?? '',
    status: mapStatus(executionState),
    duration: getFormattedDuration(step.started, step.stopped),
    children: []
  }
}

// Convert a stage to TreeViewElement format
const convertStageToTree = (stage: Stage): TreeViewElement => {
  const executionState = mapCiStatusToExecutionState(stage.status ?? ExecutionState.ERROR)

  return {
    id: getStageId(stage.number ?? 0),
    isSelectable: true,
    name: stage.name ?? '',
    status: mapStatus(executionState),
    duration: getFormattedDuration(stage.started, stage.stopped),
    children: stage.steps ? stage.steps.map(step => convertStepToTree({ stage, step })) : []
  }
}

export const convertExecutionToTree = (execution: Execution): TreeViewElement[] => {
  if (!execution || !execution.stages) return []
  return execution.stages.map(stage => convertStageToTree(stage))
}
