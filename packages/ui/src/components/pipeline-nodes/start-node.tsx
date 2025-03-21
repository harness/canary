import { Icon } from '@components/icon'

export function StartNode() {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-background-3 shadow-1">
      <Icon size={18} name="play" className="text-icons-success" />
    </div>
  )
}
