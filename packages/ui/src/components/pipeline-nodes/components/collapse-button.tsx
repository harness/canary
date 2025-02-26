import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { CollapseButtonProps } from '@harnessio/pipeline-graph'

export const CollapseButton = ({ collapsed, onToggle }: CollapseButtonProps) => {
  return (
    <Button
      className="bg-background-4 text-icons-1 hover:bg-background-9 hover:text-icons-3"
      variant="custom"
      size="xs_icon"
      onMouseDown={e => e.stopPropagation()}
      onClick={onToggle}
    >
      <Icon name={collapsed ? 'collapse-out' : 'collapse-in'} />
    </Button>
  )
}
