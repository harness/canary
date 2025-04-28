import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Informer, InformerProps } from '@/components'
import { NonEmptyReactNode } from '@/types'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const labelVariants = cva('label', {
  variants: {
    variant: {
      default: 'label-default',
      primary: 'label-primary'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type LabelProps = Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'color'> &
  VariantProps<typeof labelVariants> & {
    disabled?: boolean
    optional?: boolean
    informerProps?: InformerProps
    informerContent?: NonEmptyReactNode
  }

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, children, variant = 'default', optional, disabled, informerContent, ...props }, ref) => {
    const LabelComponent = ({ className }: { className?: string }) => (
      <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant }), className)} {...props}>
        {children} {optional && <span className="label-optional">(optional)</span>}
      </LabelPrimitive.Root>
    )

    if (informerContent) {
      return (
        <span className={cn('flex items-center gap-1', className)}>
          <LabelComponent />

          <Informer className="label-informer" disabled={disabled}>
            {informerContent}
          </Informer>
        </span>
      )
    }

    return <LabelComponent className={className} />
  }
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
