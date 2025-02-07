import {useContainerNodeContext} from "../../context/container-node-provider";

export interface CollapseButtonProps {
    collapsed: boolean
    onToggle?: () => void
}

export default function CollapseButton({
   collapsed,
   onToggle,
}: CollapseButtonProps) {
  const { collapseButtonComponent } = useContainerNodeContext()

  if (!!collapseButtonComponent) {
    return collapseButtonComponent({ collapsed, onToggle })
  }

  return (
    <span
      onClick={onToggle}
      className={'collapse-button'}
      style={{
        color: 'white',
        border: '1px solid #333333',
        cursor: 'pointer',
        background: '#333333',
        borderRadius: '5px',
        padding: '0px 5px',
        fontFamily: 'monospace',
        pointerEvents: 'all'
      }}
    >
      {collapsed ? '+' : '-'}
    </span>
  )
}
