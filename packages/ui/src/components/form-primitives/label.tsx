import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react'

import { Icon, Tooltip } from '@/components'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva('peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      default: 'text-cn-foreground-1 text-sm font-normal leading-none',
      primary: 'text-cn-foreground-2 text-sm font-normal leading-none'
    },
    state: {
      disabled: ''
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface LabelProps
  extends Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'>,
    Omit<VariantProps<typeof labelVariants>, 'state'> {
  disabled?: boolean
  optional?: boolean
  withInformer?: boolean
  tooltipContent?: ReactNode
}

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, children, variant = 'default', optional, disabled, withInformer, tooltipContent, ...props }, ref) => {
    const state: VariantProps<typeof labelVariants>['state'] = disabled ? 'disabled' : undefined

    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, state }), className)} {...props}>
        {children} {optional && <span className="text-cn-foreground-3 align-baseline">(optional)</span>}
      </LabelPrimitive.Root>
    )

    if (withInformer) {
      return (
        <div className={cn('flex items-center gap-1', className)}>
          <LabelComponent />

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icon name="info-circle" />
            </Tooltip.Trigger>

            {!!tooltipContent && <Tooltip.Content>{tooltipContent}</Tooltip.Content>}
          </Tooltip.Root>
        </div>
      )
    }

    return <LabelComponent className={className} />
  }
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
