// ToDo: Need to be reviewed by the XD team

import * as React from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva('leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      default: 'text-sm font-light',
      sm: 'text-xs font-light'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant }), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
