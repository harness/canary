import { IconV2, StatusBadge } from '@/components'
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
          <div className="size-2 rounded-full bg-cn-gray-soft" />
          <span className="text-cn-disabled">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-0.5">
            <IconV2 name="clock-solid" />
            <span className="text-cn-disabled">Pending</span>
          </div>
          {duration ? <span className="text-cn-disabled">{duration}</span> : null}
        </div>
      )
    case ExecutionState.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="size-2 animate-pulse rounded-full bg-cn-yellow-solid duration-1000" />
          <span className="text-studio-3">Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <div className="flex items-center gap-1.5">
            <IconV2 name="loader" color="warning" className="animate-spin" />
            <span className="text-studio-3">Running</span>
          </div>
          {duration && <span className="text-studio-3">{duration}</span>}
        </div>
      )
    case ExecutionState.KILLED:
    case ExecutionState.ERROR:
    case ExecutionState.FAILURE:
      return minimal ? (
        <StatusBadge variant="status" theme="danger">
          Failed
        </StatusBadge>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <StatusBadge icon="xmark-circle-solid" theme="danger" variant="ghost">
            Failed
          </StatusBadge>
          {duration && <span className="text-cn-danger">{duration}</span>}
        </div>
      )
    case ExecutionState.SUCCESS:
      return minimal ? (
        <StatusBadge variant="status" theme="success">
          Success
        </StatusBadge>
      ) : (
        <div className="flex items-center gap-1 rounded-md">
          <StatusBadge icon="check-circle-solid" theme="success" variant="ghost">
            Success
          </StatusBadge>
          {duration && <span className="text-cn-success">{duration}</span>}
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
      return <IconV2 name="xmark-circle-solid" color="danger" />
    case ExecutionState.SUCCESS:
      return <IconV2 name="check-circle-solid" color="success" />
    case ExecutionState.RUNNING:
      return <IconV2 name="loader" color="warning" className="animate-spin" />
    case ExecutionState.SKIPPED:
    default:
      return <></>
  }
}

export const ExecutionStatus = { Badge, Icon }
