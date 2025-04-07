// ToDo: Need to be reviewed by the XD team

import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, PropsWithChildren } from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva('peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      default: 'text-sm font-normal leading-none'
    },
    color: {
      primary: 'text-cn-foreground-1',
      secondary: 'text-cn-foreground-2',
      disabled: 'text-cn-foreground-3',
      'disabled-dark': 'text-cn-foreground-disabled'
    }
  },
  defaultVariants: {
    variant: 'default',
    color: 'primary'
  }
})

const LabelRoot = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'> & VariantProps<typeof labelVariants>
>(({ className, variant, color, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, color }), className)} {...props} />
))
LabelRoot.displayName = LabelPrimitive.Root.displayName

interface LabelProps
  extends VariantProps<typeof labelVariants>,
    PropsWithChildren<Omit<HTMLAttributes<HTMLLabelElement>, 'color'>> {
  htmlFor?: string
  optional?: boolean
  className?: string
}

/**
 * A Label component that wraps the Radix UI LabelPrimitive.Root component.
 * It supports variant and color styling through class-variance-authority.
 * @example
 * <Label htmlFor="label" optional>Label</Label>
 */
const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ htmlFor, optional, color, variant, children, className }: LabelProps, ref) => {
    return (
      <LabelRoot htmlFor={htmlFor} variant={variant} color={color} className={className} ref={ref}>
        {children} {optional && <span className="align-top text-cn-foreground-3">(optional)</span>}
      </LabelRoot>
    )
  }
)
Label.displayName = 'Label'

export { Label }
