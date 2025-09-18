import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'

import { IconWithTooltip, IconWithTooltipProps } from '@/components'
import { NonEmptyReactNode } from '@/types'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'

export type LabelProps = Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'> & {
  disabled?: boolean
  optional?: boolean
  tooltipProps?: IconWithTooltipProps
  tooltipContent?: NonEmptyReactNode
  suffix?: ReactNode
}

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, children, optional, disabled, tooltipContent, tooltipProps, suffix, ...props }, ref) => {
    if (!children) return null

    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root
        ref={ref}
        className={cn('cn-label', { 'cn-label-disabled': disabled }, className)}
        {...props}
      >
        <span className="cn-label-text">{children}</span>
        {optional && <span className="cn-label-optional">(optional)</span>}
      </LabelPrimitive.Root>
    )

    if (tooltipContent || suffix) {
      return (
        <span className={cn('cn-label-container', className)}>
          <LabelComponent />

          {tooltipContent && (
            <IconWithTooltip
              {...tooltipProps}
              className="cn-label-tooltip"
              disabled={disabled}
              content={tooltipContent}
            />
          )}

          {suffix}
        </span>
      )
    }

    return <LabelComponent className={className} />
  }
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
