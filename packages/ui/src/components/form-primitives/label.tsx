import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'

import { IconWithTooltip, IconWithTooltipProps, Layout } from '@/components'
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

    const showRequiredIndicator = optional !== true

    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root
        ref={ref}
        className={cn('cn-label', { 'cn-label-disabled': disabled }, className)}
        {...props}
      >
        <span className="cn-label-text">
          {children}
          {showRequiredIndicator ? (
            <span className="cn-label-required ml-cn-3xs" aria-hidden>
              *
            </span>
          ) : null}
        </span>
      </LabelPrimitive.Root>
    )

    if (suffix) {
      return (
        <Layout.Horizontal align="end" justify="between" gap="xs" className={cn('cn-label-wrapper', className)}>
          <span className="cn-label-container">
            <LabelComponent />

            {tooltipContent && (
              <IconWithTooltip
                {...tooltipProps}
                className="cn-label-tooltip"
                disabled={disabled}
                content={tooltipContent}
              />
            )}
          </span>

          <Layout.Horizontal align="center">{suffix}</Layout.Horizontal>
        </Layout.Horizontal>
      )
    }

    if (tooltipContent) {
      return (
        <span className={cn('cn-label-container', className)}>
          <LabelComponent />

          <IconWithTooltip
            {...tooltipProps}
            className="cn-label-tooltip"
            disabled={disabled}
            content={tooltipContent}
          />
        </span>
      )
    }

    return <LabelComponent className={className} />
  }
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
