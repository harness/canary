import { PropsWithoutRef } from 'react'

import { IconPropsV2, IconV2, Tooltip, TooltipProps } from '@/components'
import { cn } from '@/utils'

export interface InformerProps extends Omit<TooltipProps, 'children'> {
  className?: string
  /**
   * If disabled, the tooltip will not be shown
   */
  disabled?: boolean
  iconProps?: IconPropsV2
}

export const Informer = ({ className, disabled, iconProps, ...props }: InformerProps) => (
  <Tooltip {...props}>
    <button className={cn({ 'pointer-events-none': disabled }, className)} disabled={disabled}>
      <IconV2 name="info-circle" {...(iconProps as PropsWithoutRef<IconPropsV2>)} />
    </button>
  </Tooltip>
)
