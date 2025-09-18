import { PropsWithoutRef } from 'react'

import { IconPropsV2, IconV2, Tooltip, TooltipProps } from '@/components'
import { cn } from '@/utils'

export interface IconWithTooltipProps extends Omit<TooltipProps, 'children'> {
  className?: string
  /**
   * If disabled, the tooltip will not be shown
   */
  disabled?: boolean
  iconProps?: IconPropsV2
}

export const IconWithTooltip = ({ className, disabled, iconProps, ...props }: IconWithTooltipProps) => (
  <Tooltip {...props}>
    <button className={cn({ 'pointer-events-none': disabled }, className)} disabled={disabled}>
      <IconV2 name="info-circle" {...(iconProps as PropsWithoutRef<IconPropsV2>)} />
    </button>
  </Tooltip>
)
