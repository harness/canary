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
        <div className="flex items-center gap-cn-3xs">
          <div className="size-2 rounded-cn-full bg-cn-gray-secondary" />
          <span className="text-cn-disabled">Pending</span>
        </div>
      ) : (
        <div className="flex items-center gap-cn-3xs rounded-cn-3">
          <div className="flex items-center gap-cn-4xs">
            <IconV2 name="clock-solid" />
            <span className="text-cn-disabled">Pending</span>
          </div>
          {duration ? <span className="text-cn-disabled">{duration}</span> : null}
        </div>
      )
    case ExecutionState.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-cn-3xs">
          <div className="size-2 animate-pulse rounded-cn-full bg-cn-warning-primary duration-1000" />
          <span>Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-cn-3xs rounded-cn-3">
          <div className="flex items-center gap-cn-2xs">
            <IconV2 name="loader" color="warning" className="animate-spin" />
            <span>Running</span>
          </div>
          {duration && <span>{duration}</span>}
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
        <div className="flex items-center gap-cn-3xs rounded-cn-3">
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
        <div className="flex items-center gap-cn-3xs rounded-cn-3">
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
