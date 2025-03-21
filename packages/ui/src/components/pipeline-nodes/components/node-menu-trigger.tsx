import { FC } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { SerialGroupNodeProps } from '../serial-group-node'

export interface NodeMenuTriggerProps {
  onEllipsisClick?: SerialGroupNodeProps['onEllipsisClick']
}

export const NodeMenuTrigger: FC<NodeMenuTriggerProps> = ({ onEllipsisClick }) => {
  if (!onEllipsisClick) return <></>

  return (
    <Button
      style={{ top: '10px' }}
      className="absolute right-2.5 z-10"
      variant="ghost"
      size="sm_icon"
      onMouseDown={e => e.stopPropagation()}
      onClick={onEllipsisClick}
    >
      <Icon className="text-icons-2" name="more-dots-fill" size={12} />
    </Button>
  )
}
