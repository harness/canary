import { forwardRef, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const buttonLayoutVariants = cva('cn-button-layout', {
  variants: {
    orientation: {
      horizontal: 'cn-button-layout-horizontal',
      vertical: 'cn-button-layout-vertical'
    },
    horizontalAlign: {
      start: 'cn-button-layout-horizontal-start',
      end: 'cn-button-layout-horizontal-end'
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    horizontalAlign: 'end'
  }
})

interface ButtonLayoutCustomProps extends PropsWithChildren<VariantProps<typeof buttonLayoutVariants>> {
  children: ReactNode
  className?: string
}
export type ButtonLayoutRootProps = ButtonLayoutCustomProps & HTMLAttributes<HTMLDivElement>

const ButtonLayoutRoot = ({
  orientation = 'horizontal',
  horizontalAlign = 'end',
  className,
  ...props
}: ButtonLayoutRootProps) => {
  return <div className={cn(buttonLayoutVariants({ orientation, horizontalAlign }), className)} {...props} />
}
ButtonLayoutRoot.displayName = 'ButtonLayoutRoot'

const ButtonLayoutPrimary = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('cn-button-layout-primary', className)} {...props} />
)
ButtonLayoutPrimary.displayName = 'ButtonLayoutPrimary'

const ButtonLayoutSecondary = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('cn-button-layout-secondary', className)} {...props} />
)
ButtonLayoutSecondary.displayName = 'ButtonLayoutSecondary'

export const ButtonLayout = Object.assign((props: ButtonLayoutRootProps) => <ButtonLayoutRoot {...props} />, {
  Root: ButtonLayoutRoot,
  Primary: ButtonLayoutPrimary,
  Secondary: ButtonLayoutSecondary
})
