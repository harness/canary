import { useTheme } from '@/context'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

export function StartNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
        'border-graph-border-1 shadow-1 flex size-full items-center justify-center rounded-full border',
<<<<<<< HEAD
        isLightTheme ? 'bg-cn-background-1' : 'bg-cn-background-3'
=======
        isLightTheme ? 'bg-cds-background-1' : 'bg-cds-background-3'
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
      )}
    >
      <Icon size={18} name="play" className="text-icons-4" />
    </div>
  )
}
