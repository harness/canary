import { useTheme } from '@/context'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

export function StartNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'border-graph-border-1 shadow-1 flex size-full items-center justify-center rounded-full border',
        isLightTheme ? 'bg-background-1' : 'bg-background-3'
      )}
    >
      <Icon size={18} name="play" className="text-icons-4" />
    </div>
  )
}
