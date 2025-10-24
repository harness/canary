import { Icon as CanaryIcon } from '@components/icon'

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
          <div className="size-2 rounded-full bg-muted" />
          <span className="text-muted">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-muted bg-muted/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5">
            <CanaryIcon size={12} name="pending-clock" />
            <span className="text-muted">Pending</span>
          </div>
          {duration && <span className="text-muted">{duration}</span>}
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
            <CanaryIcon size={16} name="running" className="animate-spin text-warning" />
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
            <CanaryIcon name="fail" width={20} />
            <span className="text-[#ED5E5E]">Failed</span>
          </div>
          {duration && <span className="text-[#ED5E5E]">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-success" />
          <span className="text-foreground-success">Success</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-solid border-success bg-success/[0.1] px-1 py-0.5">
          <div className="flex items-center gap-0.5 text-foreground-success">
            <CanaryIcon size={12} name="success" />
            <span>Success</span>
          </div>
          {duration && <span className="text-foreground-success">{duration}</span>}
        </div>
      )
    case PipelineExecutionStatus.SKIPPED:
    default:
      return <></>
  }
}
