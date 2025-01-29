import { Icon } from '@harnessio/canary'
import { EnumCiStatus, TypesExecution } from '@harnessio/code-service-client'
import { MeterState } from '@harnessio/ui/components'
import { PipelineExecutionStatus } from '@harnessio/ui/views'

const renderBranch = (branch: string): React.ReactElement => {
  return (
    <div className="flex items-center gap-1 rounded-md bg-tertiary-background/10 px-1.5 font-mono">
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

export const getExecutionStatus = (status?: EnumCiStatus): PipelineExecutionStatus => {
  switch (status) {
    case 'running':
      return PipelineExecutionStatus.RUNNING
    case 'success':
      return PipelineExecutionStatus.SUCCESS
    case 'failure':
      return PipelineExecutionStatus.FAILURE
    case 'error':
      return PipelineExecutionStatus.ERROR
    case 'killed':
      return PipelineExecutionStatus.KILLED
    default:
      return PipelineExecutionStatus.UNKNOWN
  }
}

export const getMeterState = (status?: EnumCiStatus): MeterState => {
  switch (status) {
    case PipelineExecutionStatus.FAILURE:
    case PipelineExecutionStatus.KILLED:
    case PipelineExecutionStatus.ERROR:
      return MeterState.Error
    case PipelineExecutionStatus.SUCCESS:
      return MeterState.Success
    case PipelineExecutionStatus.SKIPPED:
    case PipelineExecutionStatus.BLOCKED:
      return MeterState.Warning
    case PipelineExecutionStatus.PENDING:
    case PipelineExecutionStatus.WAITING_ON_DEPENDENCIES:
    default:
      return MeterState.Empty
  }
}
