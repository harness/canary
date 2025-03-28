import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { CollapseButtonProps } from '@harnessio/pipeline-graph'

export const CollapseButton = ({ collapsed, onToggle }: CollapseButtonProps) => {
  return (
    <Button
      className="bg-graph-background-3 text-icons-1 hover:bg-graph-background-4 hover:text-icons-3"
      variant="custom"
      size="sm_icon"
      onMouseDown={e => e.stopPropagation()}
      onClick={onToggle}
    >
      <Icon size={18} name={collapsed ? 'collapse-out' : 'collapse-in'} />
    </Button>
  )
}
