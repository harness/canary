import { Icon, IconProps, Tooltip, TooltipProps } from '@/components'
import { cn } from '@/utils'

export interface InformerProps extends TooltipProps {
  className?: string
  /**
   * If disabled, the tooltip will not be shown
   */
  disabled?: boolean
  iconProps?: Omit<IconProps, 'name'> & { name?: IconProps['name'] }
}

export const Informer = ({ children, className, disabled, iconProps, ...props }: InformerProps) => (
  <Tooltip.Root {...props}>
    <Tooltip.Trigger className={cn({ 'pointer-events-none': disabled }, className)} disabled={disabled}>
      <Icon name="info-circle" {...iconProps} />
    </Tooltip.Trigger>

    {!!children && <Tooltip.Content>{children}</Tooltip.Content>}
  </Tooltip.Root>
)
