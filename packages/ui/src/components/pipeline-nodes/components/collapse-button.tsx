import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'

export interface CollapseButtonProps {
  collapsed: boolean
  onCollapseChange: (collapsed: boolean) => void
}

export const CollapseButton = ({ collapsed, onCollapseChange }: CollapseButtonProps) => {
  return (
    <Button
      size="sm"
      variant="secondary"
      iconOnly
      onMouseDown={e => e.stopPropagation()}
      onClick={() => onCollapseChange(!collapsed)}
      tooltipProps={{
        content: collapsed ? 'Expand' : 'Collapse'
      }}
    >
      <IconV2 size="md" name={collapsed ? 'enlarge' : 'reduce'} />
    </Button>
  )
}
