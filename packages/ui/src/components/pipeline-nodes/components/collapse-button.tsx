import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { CollapseButtonProps } from '@harnessio/pipeline-graph'

export const CollapseButton = ({ collapsed, onToggle }: CollapseButtonProps) => {
  return (
    <Button size="sm" variant="secondary" iconOnly onMouseDown={e => e.stopPropagation()} onClick={onToggle}>
      <Icon size={18} name={collapsed ? 'collapse-out' : 'collapse-in'} />
    </Button>
  )
}
