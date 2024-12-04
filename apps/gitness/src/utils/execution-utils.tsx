import { Icon, Meter } from '@harnessio/canary'
import { EnumCiStatus, TypesExecution } from '@harnessio/code-service-client'
import { ExecutionState } from '@harnessio/views'

const renderBranch = (branch: string): React.ReactElement => {
  return (
    <div className="bg-tertiary-background/10 flex items-center gap-1 rounded-md px-1.5 font-mono">
      <Icon name="branch" size={11} className="text-tertiary-background" />
      {branch}
    </div>
  )
}

export const getLabel = (execution: TypesExecution): string | React.ReactElement => {
  const { author_name, event, source, target } = execution
  if (!author_name || !event) {
    return ''
  }
  switch (event) {
    case 'manual':
      return `${author_name} triggered manually`
    case 'pull_request':
      return (
        <div className="flex items-center gap-1">
          <span>{`${author_name} created pull request`}</span>
          {source && <>from{renderBranch(source)}</>}
          {source && <span>to</span>}
          {target && renderBranch(target)}
        </div>
      )
    default:
      return ''
  }
}

export const getExecutionStatus = (status?: EnumCiStatus): ExecutionState => {
  switch (status) {
    case 'running':
      return ExecutionState.RUNNING
    case 'success':
      return ExecutionState.SUCCESS
    case 'failure':
      return ExecutionState.FAILURE
    case 'error':
      return ExecutionState.ERROR
    case 'killed':
      return ExecutionState.KILLED
    default:
      return ExecutionState.UNKNOWN
  }
}

export const getMeterState = (status?: EnumCiStatus): Meter.MeterState => {
  switch (status) {
    case ExecutionState.FAILURE:
    case ExecutionState.KILLED:
    case ExecutionState.ERROR:
      return Meter.MeterState.Error
    case ExecutionState.SUCCESS:
      return Meter.MeterState.Success
    case ExecutionState.SKIPPED:
    case ExecutionState.BLOCKED:
      return Meter.MeterState.Warning
    case ExecutionState.PENDING:
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    default:
      return Meter.MeterState.Empty
  }
}
