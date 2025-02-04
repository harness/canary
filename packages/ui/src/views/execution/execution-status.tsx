import { Icon as CanaryIcon } from '@/components'
import { ExecutionState } from '@views/repo/pull-request'

import { BadgeProps, ExecutionStatusProps } from './types'

const Badge: React.FC<ExecutionStatusProps & BadgeProps> = props => {
  const { status, duration, minimal } = props
  switch (status) {
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.BLOCKED:
    case ExecutionState.PENDING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-muted" />
          <span className="text-muted">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-0.5">
            <CanaryIcon size={12} name="pending-clock" />
            <span className="text-muted">Pending</span>
          </div>
          {duration ? <span className="text-muted">{duration}</span> : null}
        </div>
      )
    case ExecutionState.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-studio-3" />
          <span className="text-studio-3">Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-1">
            <CanaryIcon size={16} name="running" className="animate-spin text-warning" />
            <span className="text-studio-3">Running</span>
          </div>
          {duration && <span className="text-studio-3">{duration}</span>}
        </div>
      )
    case ExecutionState.KILLED:
    case ExecutionState.ERROR:
    case ExecutionState.FAILURE:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-[#ED5E5E]" />
          <span className="text-[#ED5E5E]">Failed</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-0.5">
            <CanaryIcon name="fail" width={20} />
            <span className="text-[#ED5E5E]">Failed</span>
          </div>
          {duration && <span className="text-[#ED5E5E]">{duration}</span>}
        </div>
      )
    case ExecutionState.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-success" />
          <span className="text-success">Success</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-0.5">
            <CanaryIcon size={12} name="success" />
            <span className="text-success">Success</span>
          </div>
          {duration && <span className="text-success">{duration}</span>}
        </div>
      )
    case ExecutionState.SKIPPED:
    default:
      return <></>
  }
}

const Icon: React.FC<ExecutionStatusProps> = props => {
  const { status } = props
  switch (status) {
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.PENDING:
      return <CanaryIcon size={16} name="pending-clock" />
    case ExecutionState.KILLED:
    case ExecutionState.FAILURE:
    case ExecutionState.ERROR:
      return <CanaryIcon size={16} name="fail" />
    case ExecutionState.SUCCESS:
      return <CanaryIcon size={16} name="success" />
    case ExecutionState.RUNNING:
      return <CanaryIcon size={20} name="running" className="animate-spin text-warning" />
    case ExecutionState.SKIPPED:
    default:
      return <></>
  }
}

export const ExecutionStatus = { Badge, Icon }
