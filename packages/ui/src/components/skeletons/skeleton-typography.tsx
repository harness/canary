import { forwardRef, HTMLAttributes } from 'react'

import { typographyVariantConfig } from '@components/text'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonTypographyVariants = cva('cn-skeleton-typography-wrapper', {
  variants: {
    variant: typographyVariantConfig
  },
  defaultVariants: {
    variant: 'body-normal'
  }
})

export interface SkeletonTypographyProps {
  variant?: VariantProps<typeof skeletonTypographyVariants>['variant']
  wrapperClassName?: string
  className?: string
}

export const SkeletonTypography = forwardRef<HTMLDivElement, SkeletonTypographyProps & HTMLAttributes<HTMLDivElement>>(
  ({ variant, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn(skeletonTypographyVariants({ variant }), wrapperClassName)} ref={ref} {...props}>
        <SkeletonBase className={cn('cn-skeleton-typography-child', className)} />
      </div>
    )
  }
)

SkeletonTypography.displayName = 'SkeletonTypography'
