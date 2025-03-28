import { Icon as CanaryIcon } from '@components/icon'

import { PipelineExecutionStatus } from '../common/execution-types'

interface IExecutionStatusIconProps {
  status?: PipelineExecutionStatus
}

export const ExecutionStatusIcon: React.FC<IExecutionStatusIconProps> = props => {
  const { status } = props
  switch (status) {
    case PipelineExecutionStatus.WAITING_ON_DEPENDENCIES:
    case PipelineExecutionStatus.PENDING:
      return <CanaryIcon size={16} name="pending-clock" />
    case PipelineExecutionStatus.KILLED:
    case PipelineExecutionStatus.FAILURE:
    case PipelineExecutionStatus.ERROR:
      return <CanaryIcon size={16} name="fail-legacy" />
    case PipelineExecutionStatus.SUCCESS:
      return <CanaryIcon size={16} name="success" className="text-foreground-success" />
    case PipelineExecutionStatus.RUNNING:
      return <CanaryIcon size={20} name="running" className="animate-spin text-warning" />
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <CanaryIcon size={16} name="pending-clock" className="opacity-50" />
  }
}
