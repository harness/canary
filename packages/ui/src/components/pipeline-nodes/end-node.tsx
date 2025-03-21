import { Icon } from '@components/icon'

export function EndNode() {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-background-3 shadow-1">
      <Icon name="stop" size={14} className="text-icons-1" />
    </div>
  )
}
