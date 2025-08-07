import { forwardRef } from 'react'

import { logoVariants } from '@/components'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonLogoVariants: typeof logoVariants = cva('cn-skeleton-logo', {
  variants: {
    size: {
      sm: 'cn-skeleton-logo-sm',
      md: 'cn-skeleton-logo-md',
      lg: 'cn-skeleton-logo-lg'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export interface SkeletonLogoProps {
  size: VariantProps<typeof skeletonLogoVariants>['size']
  className?: string
}

export const SkeletonLogo = forwardRef<HTMLDivElement, SkeletonLogoProps>(({ size, className, ...props }, ref) => {
  return <SkeletonBase className={cn(skeletonLogoVariants({ size }), className)} ref={ref} {...props} />
})

SkeletonLogo.displayName = 'SkeletonLogo'
