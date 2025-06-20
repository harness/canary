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
          <div className="size-2 rounded-full bg-cn-background-softgray" />
          <span className="text-cn-foreground-disabled">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-cn-borders-1 bg-cn-background-softgray/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5">
            <IconV2 name="clock-solid" />
            <span className="text-cn-foreground-disabled">Pending</span>
          </div>
          {duration && <span className="text-cn-foreground-disabled">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="bg-studio-3 size-2 rounded-full" />
          <span className="text-studio-3">Running</span>
        </div>
      ) : (
        <div className="border-studio-3/[0.12] bg-studio-3/10 flex items-center gap-1 rounded-md border border-solid px-1 py-0.5">
          <div className="flex items-center gap-1">
            <IconV2 name="loader" className="animate-spin text-cn-foreground-warning" />
            <span className="text-studio-3">Running</span>
          </div>
          {duration && <span className="text-studio-3">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.KILLED:
    case PipelineExecutionStatus.ERROR:
    case PipelineExecutionStatus.FAILURE:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-[#ED5E5E]" />
          <span className="text-[#ED5E5E]">Failed</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-[#F76E6E1F] bg-[#F76E6E1A]/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5">
            <IconV2 name="xmark-circle-solid" className="text-cn-foreground-danger" />
            <span className="text-[#ED5E5E]">Failed</span>
          </div>
          {duration && <span className="text-[#ED5E5E]">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-cn-background-success" />
          <span className="text-cn-foreground-success">Success</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-cn-borders-success bg-cn-background-success/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5 text-cn-foreground-success">
            <IconV2 name="check-circle-solid" />
            <span>Success</span>
          </div>
          {duration && <span className="text-cn-foreground-success">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <></>
  }
}
