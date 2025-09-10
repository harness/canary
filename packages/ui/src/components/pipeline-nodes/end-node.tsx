import { useTheme } from '@/context'
import { cn } from '@/utils'
import { IconV2 } from '@components/icon-v2'

export function EndNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-cn-3 shadow-4',
        { 'bg-cn-1': isLightTheme }
      )}
    >
      <IconV2 name="stop" size="xs" className="text-cn-3" />
    </div>
  )
}
