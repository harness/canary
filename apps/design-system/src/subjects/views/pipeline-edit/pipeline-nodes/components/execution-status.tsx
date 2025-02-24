import { Badge, Icon } from '@harnessio/ui/components'

import { StepNodeDataType } from '../../nodes/custom-step-node'

export const ExecutionStatus = ({ nodeData }: { nodeData: StepNodeDataType }) => {
  if (!nodeData?.state) return null

  return (
    <div className="absolute right-0" style={{ top: '-25px' }}>
      {nodeData.state === 'executing' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="muted">
          <Icon name="running" size={12} className="mr-1 animate-spin" />
          Running
        </Badge>
      ) : nodeData.state === 'success' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme={'success'}>
          <Icon name="tick" size={12} className="mr-1" />
          Completed
        </Badge>
      ) : nodeData.state === 'warning' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="warning">
          <Icon name="triangle-warning" size={12} className="mr-1" />
          Warning
        </Badge>
      ) : nodeData.state === 'error' ? (
        <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="destructive">
          <Icon name="cross" size={12} className="mr-1" />
          Error
        </Badge>
      ) : null}
    </div>
  )
}
