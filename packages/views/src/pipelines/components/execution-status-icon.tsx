import { IconV2 } from '@harnessio/ui/components'

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
      return <IconV2 name="xmark-circle-solid" color="danger" />
    case PipelineExecutionStatus.SUCCESS:
      return <IconV2 name="check-circle-solid" color="success" />
    case PipelineExecutionStatus.RUNNING:
      return <IconV2 name="loader" color="warning" className="animate-spin" />
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <IconV2 name="clock-solid" color="neutral" />
  }
}
