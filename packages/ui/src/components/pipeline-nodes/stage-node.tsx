import { Button, Icon } from '..'

export interface StageNodeProps {
  name?: string
  children?: React.ReactElement
  collapsed?: boolean
  isEmpty?: boolean
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function StageNode(props: StageNodeProps) {
  const { name, children, collapsed, isEmpty, onEllipsisClick, onAddClick } = props

  return (
    <>
      <div className="absolute inset-0 -z-10 rounded-xl border border-borders-2" />

      <div className="absolute inset-x-0 top-0 h-0">
        <div title={name} className="h-9 cursor-default truncate px-9 pt-2.5 text-primary-muted">
          {name}
        </div>
      </div>

      {onEllipsisClick && (
        <Button
          className="absolute right-2 top-2 z-10"
          variant="ghost"
          size="sm_icon"
          onMouseDown={e => e.stopPropagation()}
          onClick={onEllipsisClick}
        >
          <Icon name="ellipsis" size={15} />
        </Button>
      )}

      {!collapsed && isEmpty && (
        <Button
          className="self-center rounded-full p-3"
          variant="outline"
          size="lg"
          onMouseDown={e => e.stopPropagation()}
          onClick={onAddClick}
        >
          <Icon name="plus" size={15} />
        </Button>
      )}

      {children}
    </>
  )
}
