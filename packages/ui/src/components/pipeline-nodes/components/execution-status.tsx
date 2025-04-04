import { Badge } from '@/components'

import { ExecutionStatusType } from '../types/types'

export const ExecutionStatus = ({ executionStatus }: { executionStatus: ExecutionStatusType }) => {
  if (!executionStatus) return null

  return (
    <div className="absolute right-0" style={{ top: '-25px' }}>
      {executionStatus === 'executing' ? (
        <Badge className="leading-none" size="sm" variant="status" theme="warning">
          Running
        </Badge>
      ) : executionStatus === 'success' ? (
        <Badge className="leading-none" size="sm" variant="status" theme="success">
          Completed
        </Badge>
      ) : executionStatus === 'warning' ? (
        <Badge className="leading-none" size="sm" variant="status" theme="warning">
          Warning
        </Badge>
      ) : executionStatus === 'error' ? (
        <Badge className="leading-none" size="sm" variant="status" theme="danger">
          Error
        </Badge>
      ) : null}
    </div>
  )
}
