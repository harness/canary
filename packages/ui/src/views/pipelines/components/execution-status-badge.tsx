import { IconV2 } from '@components/icon-v2'

import { PipelineExecutionStatus } from '../common/execution-types'

interface IExecutionStatusBadgeProps {
  status: PipelineExecutionStatus
  /* duration formatted as string */
  duration: string
  minimal?: boolean
}

export const ExecutionStatusBadge: React.FC<IExecutionStatusBadgeProps> = props => {
  const { status, duration, minimal } = props
  switch (status) {
    case PipelineExecutionStatus.WAITING_ON_DEPENDENCIES:
    case PipelineExecutionStatus.BLOCKED:
    case PipelineExecutionStatus.PENDING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="bg-cn-gray-secondary size-2 rounded-full" />
          <span className="text-cn-disabled">Pending</span>
        </div>
      ) : (
        <div className="border-cn-1 bg-cn-gray-secondary/[0.1] flex items-center gap-1 rounded-md border border-solid px-1 py-0.5">
          <div className="flex items-center gap-0.5">
            <IconV2 name="clock-solid" />
            <span className="text-cn-disabled">Pending</span>
          </div>
          {duration && <span className="text-cn-disabled">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full" />
          <span>Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid px-1 py-0.5">
          <div className="flex items-center gap-1">
            <IconV2 name="loader" color="warning" className="animate-spin" />
            <span>Running</span>
          </div>
          {duration && <span>{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.KILLED:
    case PipelineExecutionStatus.ERROR:
    case PipelineExecutionStatus.FAILURE:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-[#ED5E5E]" />
          <span className="text-cn-danger">Failed</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-[#F76E6E1F] bg-[#F76E6E1A]/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5">
            <IconV2 name="xmark-circle-solid" color="danger" />
            <span className="text-cn-danger">Failed</span>
          </div>
          {duration && <span className="text-cn-danger">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="bg-cn-success-primary size-2 rounded-full" />
          <span className="text-cn-success">Success</span>
        </div>
      ) : (
        <div className="border-cn-success bg-cn-success-primary/[0.1] flex items-center gap-1 rounded-md border border-solid px-1 py-0.5">
          <div className="text-cn-success flex items-center gap-0.5">
            <IconV2 name="check-circle-solid" color="success" />
            <span>Success</span>
          </div>
          {duration && <span className="text-cn-success">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <></>
  }
}
