import { StatusBadge } from '@/components'

import { ExecutionStatusType } from '../types/types'

export const ExecutionStatus = ({ executionStatus }: { executionStatus: ExecutionStatusType }) => {
  if (!executionStatus) return null

  return (
    <div className="absolute right-0" style={{ top: '-25px' }}>
      {executionStatus === 'executing' ? (
        <StatusBadge className="leading-none" size="sm" variant="status" theme="warning">
          Running
        </StatusBadge>
      ) : executionStatus === 'success' ? (
        <StatusBadge className="leading-none" size="sm" variant="status" theme="success">
          Completed
        </StatusBadge>
      ) : executionStatus === 'warning' ? (
        <StatusBadge className="leading-none" size="sm" variant="status" theme="warning">
          Warning
        </StatusBadge>
      ) : executionStatus === 'error' ? (
        <StatusBadge className="leading-none" size="sm" variant="status" theme="danger">
          Error
        </StatusBadge>
      ) : null}
    </div>
  )
}
