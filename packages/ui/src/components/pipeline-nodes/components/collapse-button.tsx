import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

import { CollapseButtonProps } from '@harnessio/pipeline-graph'

export const CollapseButton = ({ collapsed, onToggle }: CollapseButtonProps) => {
  return (
    <Button size="sm" variant="secondary" iconOnly onMouseDown={e => e.stopPropagation()} onClick={onToggle}>
      <IconV2 size="md" name={collapsed ? 'enlarge' : 'reduce'} />
    </Button>
  )
}
