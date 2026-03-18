import { useTheme } from '@harnessio/ui/context'
import { IconV2 } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

export function StartNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'border-cn-gray-outline shadow-cn-4 flex size-full items-center justify-center rounded-cn-full border-[1.2px]',
        isLightTheme ? 'bg-cn-1' : 'bg-cn-3'
      )}
    >
      <IconV2 size="md" name="play" className="text-cn-3" />
    </div>
  )
}
