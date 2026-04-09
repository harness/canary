import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'

import { IconWithTooltip, IconWithTooltipProps } from '@/components'
import { NonEmptyReactNode } from '@/types'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'

/**
 * Legacy form labels used a trailing ":" and a "(optional)" suffix; accordion section headers could show "Optional".
 * Set to `true` to restore that behavior. `formatLabel` in platformUI follows this flag for colons.
 */
export const FORM_LABEL_LEGACY_AFFIXES = false

export type LabelProps = Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'> & {
  disabled?: boolean
  optional?: boolean
  /** When true, shows a required-field indicator after the label text. */
  required?: boolean
  tooltipProps?: IconWithTooltipProps
  tooltipContent?: NonEmptyReactNode
  suffix?: ReactNode
}

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, children, optional, required, disabled, tooltipContent, tooltipProps, suffix, ...props }, ref) => {
    if (!children) return null

    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root
        ref={ref}
        className={cn('cn-label', { 'cn-label-disabled': disabled }, className)}
        {...props}
      >
        <span className="cn-label-text">
          {children}
          {required ? (
            <span className="cn-label-required ml-cn-3xs" aria-hidden>
              *
            </span>
          ) : null}
        </span>
        {optional && FORM_LABEL_LEGACY_AFFIXES ? <span className="cn-label-optional">(optional)</span> : null}
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
