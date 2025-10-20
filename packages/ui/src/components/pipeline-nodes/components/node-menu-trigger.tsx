import { FC } from 'react'

import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

import { SerialGroupNodeProps } from '../serial-group-node'

export interface NodeMenuTriggerProps {
  onEllipsisClick?: SerialGroupNodeProps['onEllipsisClick']
}

export const NodeMenuTrigger: FC<NodeMenuTriggerProps> = ({ onEllipsisClick }) => {
  if (!onEllipsisClick) return <></>

  return (
    <Button
      className="absolute right-cn-xs top-cn-xs z-10"
      variant="ghost"
      size="sm"
      iconOnly
      onMouseDown={e => e.stopPropagation()}
      onClick={onEllipsisClick}
      ignoreIconOnlyTooltip
    >
      <IconV2 name="more-horizontal" size="2xs" />
    </Button>
  )
}
