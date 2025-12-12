export interface CollapseButtonProps {
  collapsed: boolean
  onCollapseChange: (collapsed: boolean) => void
}

export const CollapseButton = ({ collapsed, onCollapseChange }: CollapseButtonProps) => {
  return (
    <button onMouseDown={e => e.stopPropagation()} onClick={() => onCollapseChange(!collapsed)}>
      {collapsed ? '+' : '-'}
    </button>
  )
}
