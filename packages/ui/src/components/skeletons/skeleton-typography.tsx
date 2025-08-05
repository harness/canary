import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonTypographyVariants = cva('cn-skeleton-typography-wrapper', {
  variants: {
    variant: {
      'heading-hero': 'font-heading-hero',
      'heading-section': 'font-heading-section',
      'heading-subsection': 'font-heading-subsection',
      'heading-base': 'font-heading-base',
      'heading-small': 'font-heading-small',
      body: 'font-body-normal',
      'body-code': 'font-body-code',
      'body-single-line': 'font-body-single-line-normal',
      'body-single-line-code': 'font-body-single-line-normal',
      caption: 'font-caption-normal',
      'caption-single-line': 'font-caption-single-line-normal'
    }
  },
  defaultVariants: {
    variant: 'body'
  }
})

export interface SkeletonTypographyProps {
  variant?: VariantProps<typeof skeletonTypographyVariants>['variant']
  wrapperClassName?: string
  className?: string
}

export const SkeletonTypography = forwardRef<HTMLDivElement, SkeletonTypographyProps>(
  ({ variant, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn(skeletonTypographyVariants({ variant }), wrapperClassName)}>
        <SkeletonBase className={cn('cn-skeleton-typography-child', className)} ref={ref} {...props} />
      </div>
    )
  }
)

SkeletonTypography.displayName = 'SkeletonTypography'
