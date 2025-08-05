import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonIconVariants = cva('cn-skeleton-icon', {
  variants: {
    size: {
      '2xs': 'cn-skeleton-icon-2xs',
      xs: 'cn-skeleton-icon-xs',
      sm: 'cn-skeleton-icon-sm',
      md: 'cn-skeleton-icon-md',
      lg: 'cn-skeleton-icon-lg',
      xl: 'cn-skeleton-icon-xl'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

export interface SkeletonIconProps {
  size: VariantProps<typeof skeletonIconVariants>['size']
  className?: string
}

export const SkeletonIcon = forwardRef<HTMLDivElement, SkeletonIconProps>(({ size, className, ...props }, ref) => {
  return <SkeletonBase className={cn(skeletonIconVariants({ size }), className)} ref={ref} {...props} />
})

SkeletonIcon.displayName = 'SkeletonIcon'
