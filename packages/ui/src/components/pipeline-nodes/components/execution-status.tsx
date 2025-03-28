import { Badge, Icon } from '@/components'

import { ExecutionStatusType } from '../types/types'

export const ExecutionStatus = ({ executionStatus }: { executionStatus: ExecutionStatusType }) => {
  if (!executionStatus) return null

  return (
    <div className="absolute right-0" style={{ top: '-25px' }}>
      {executionStatus === 'executing' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="warning">
          <Icon name="running" size={10} className="mr-1 animate-spin" />
          Running
        </Badge>
      ) : executionStatus === 'success' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme={'success'}>
          <Icon name="tick" size={10} className="mr-1" />
          Completed
        </Badge>
      ) : executionStatus === 'warning' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="warning">
          <Icon name="triangle-warning" size={10} className="mr-1" />
          Warning
        </Badge>
      ) : executionStatus === 'error' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="destructive">
          <Icon name="cross" size={10} className="mr-1" />
          Error
        </Badge>
      ) : null}
    </div>
  )
}
