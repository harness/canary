import { useTheme } from '@/context'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

export function StartNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'border-graph-border-1 shadow-4 flex size-full items-center justify-center rounded-full border',
        isLightTheme ? 'bg-cn-background-1' : 'bg-cn-background-3'
      )}
    >
      <Icon size={18} name="play" className="text-icons-4" />
    </div>
  )
}
