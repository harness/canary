import { CollapseButtonProps } from '@harnessio/pipeline-graph'
import { Button, Icon } from '@harnessio/ui/components'

export const CollapseButton = ({ collapsed, onToggle }: CollapseButtonProps) => {
  return (
    <Button
      className="bg-graph-background-3 hover:bg-graph-background-4 text-icons-1 hover:text-icons-3"
      variant="custom"
      size="xs_icon"
      onMouseDown={e => e.stopPropagation()}
      onClick={onToggle}
    >
      <Icon name={collapsed ? 'collapse-out' : 'collapse-in'} />
    </Button>
  )
}
