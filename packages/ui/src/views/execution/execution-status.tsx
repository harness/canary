import { IconV2 } from '@/components'
import { ExecutionState } from '@views/repo/pull-request'

import { BadgeProps, ExecutionStatusProps } from './types'

const Badge: React.FC<ExecutionStatusProps & BadgeProps> = props => {
  const { status, duration, minimal } = props
  switch (status.toLowerCase()) {
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.BLOCKED:
    case ExecutionState.PENDING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-cn-background-softgray" />
          <span className="text-cn-foreground-disabled">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-0.5">
            <IconV2 name="clock-solid" />
            <span className="text-cn-foreground-disabled">Pending</span>
          </div>
          {duration ? <span className="text-cn-foreground-disabled">{duration}</span> : null}
        </div>
      )
    case ExecutionState.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 animate-pulse rounded-full bg-cn-background-warning duration-1000" />
          <span className="text-studio-3">Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-1.5">
            <IconV2 name="loader" className="animate-spin text-cn-foreground-warning" />
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
          <div className="flex items-center gap-1.5">
            <IconV2 name="xmark-circle-solid" className="text-cn-foreground-danger" />
            <span className="text-[#ED5E5E]">Failed</span>
          </div>
          {duration && <span className="text-[#ED5E5E]">{duration}</span>}
        </div>
      )
    case ExecutionState.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-cn-background-success" />
          <span className="text-cn-foreground-success">Success</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-1.5 text-cn-foreground-success">
            <IconV2 name="check-circle-solid" />
            <span>Success</span>
          </div>
          {duration && <span className="text-cn-foreground-success">{duration}</span>}
        </div>
      )
    case ExecutionState.SKIPPED:
    default:
      return <></>
  }
}

const Icon: React.FC<ExecutionStatusProps> = props => {
  const { status } = props
  switch (status.toLowerCase()) {
    case ExecutionState.WAITING_ON_DEPENDENCIES:
    case ExecutionState.PENDING:
      return <IconV2 name="clock-solid" />
    case ExecutionState.KILLED:
    case ExecutionState.FAILURE:
    case ExecutionState.ERROR:
      return <IconV2 name="xmark-circle-solid" className="text-cn-foreground-danger" />
    case ExecutionState.SUCCESS:
      return <IconV2 name="check-circle-solid" className="text-cn-foreground-success" />
    case ExecutionState.RUNNING:
      return <IconV2 name="loader" className="animate-spin text-cn-foreground-warning" />
    case ExecutionState.SKIPPED:
    default:
      return <></>
  }
}

export const ExecutionStatus = { Badge, Icon }
