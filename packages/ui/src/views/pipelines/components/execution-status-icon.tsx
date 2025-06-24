import { IconV2 } from '@components/icon-v2'

import { PipelineExecutionStatus } from '../common/execution-types'

interface IExecutionStatusIconProps {
  status?: PipelineExecutionStatus
}

export const ExecutionStatusIcon: React.FC<IExecutionStatusIconProps> = props => {
  const { status } = props
  switch (status) {
    case PipelineExecutionStatus.WAITING_ON_DEPENDENCIES:
    case PipelineExecutionStatus.PENDING:
      return <IconV2 name="clock-solid" />
    case PipelineExecutionStatus.KILLED:
    case PipelineExecutionStatus.FAILURE:
    case PipelineExecutionStatus.ERROR:
      return <IconV2 name="xmark-circle-solid" className="text-cn-foreground-danger" />
    case PipelineExecutionStatus.SUCCESS:
      return <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
    case PipelineExecutionStatus.RUNNING:
      return <IconV2 name="loader" className="animate-spin text-cn-foreground-warning" />
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <IconV2 name="clock-solid" className="opacity-50" />
  }
}
