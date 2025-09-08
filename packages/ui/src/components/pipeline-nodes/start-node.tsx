import { useTheme } from '@/context'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

export function StartNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'border-graph-border-1 shadow-4 flex size-full items-center justify-center rounded-full border',
        isLightTheme ? 'bg-cn-1' : 'bg-cn-3'
      )}
    >
      <IconV2 size="md" name="play" className="text-icons-4" />
    </div>
  )
}
