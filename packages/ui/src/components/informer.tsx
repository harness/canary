import { Icon, IconProps, Tooltip, TooltipProps } from '@/components'
import { cn } from '@/utils'

export interface InformerProps extends Omit<TooltipProps, 'children'> {
  className?: string
  /**
   * If disabled, the tooltip will not be shown
   */
  disabled?: boolean
  iconProps?: Omit<IconProps, 'name'> & { name?: IconProps['name'] }
}

export const Informer = ({ className, disabled, iconProps, ...props }: InformerProps) => (
  <Tooltip {...props}>
    <button className={cn({ 'pointer-events-none': disabled }, className)} disabled={disabled}>
      <Icon name="info-circle" {...iconProps} />
    </button>
  </Tooltip>
)
