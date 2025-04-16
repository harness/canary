import { useTheme } from '@/context'
import { cn } from '@/utils'
import { Icon } from '@components/icon'

export function EndNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-cn-background-3 shadow-4',
        { 'bg-cn-background-1': isLightTheme }
      )}
    >
      <Icon name="stop" size={14} className="text-icons-4" />
    </div>
  )
}
