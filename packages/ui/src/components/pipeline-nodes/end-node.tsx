import { useTheme } from '@/context'
import { cn } from '@/utils'
import { Icon } from '@components/icon'

export function EndNode() {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn(
<<<<<<< HEAD
        'flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-cn-background-3 shadow-1',
        { 'bg-cn-background-1': isLightTheme }
=======
        'flex size-full items-center justify-center rounded-full border border-graph-border-1 bg-cds-background-3 shadow-1',
        { 'bg-cds-background-1': isLightTheme }
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
      )}
    >
      <Icon name="stop" size={14} className="text-icons-4" />
    </div>
  )
}
