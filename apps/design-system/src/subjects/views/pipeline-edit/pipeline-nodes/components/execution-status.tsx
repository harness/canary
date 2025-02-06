import { Badge, Icon } from '@harnessio/ui/components'

import { StepNodeDataType } from '../../nodes/custom-step-node'

export type ExecutionStatusAlign = 'left' | 'right'

export function ExecutionStatus({
  nodeData,
  align = 'left'
}: {
  nodeData: StepNodeDataType
  align?: ExecutionStatusAlign
}) {
  return (
    <>
      {nodeData.state === 'executing' ? (
        <div style={{ position: 'absolute', top: '-23px', [align]: '0px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="muted">
            <Icon name="running" size={12} className="mr-1 animate-spin" />
            Running
          </Badge>
        </div>
      ) : nodeData.state === 'success' ? (
        <div style={{ position: 'absolute', top: '-23px', [align]: '0px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme={'success'}>
            <Icon name="tick" size={12} className="mr-1" />
            Completed
          </Badge>
        </div>
      ) : nodeData.state === 'warning' ? (
        <div style={{ position: 'absolute', top: '-23px', [align]: '0px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="warning">
            <Icon name="triangle-warning" size={12} className="mr-1" />
            Warning
          </Badge>
        </div>
      ) : nodeData.state === 'error' ? (
        <div style={{ position: 'absolute', top: '-23px', [align]: '0px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="destructive">
            <Icon name="cross" size={12} className="mr-1" />
            Error
          </Badge>
        </div>
      ) : null}
    </>
  )
}
