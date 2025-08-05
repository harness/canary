import { forwardRef } from 'react'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonAvatarVariants = cva('cn-skeleton-avatar', {
  variants: {
    size: {
      sm: 'cn-skeleton-avatar-sm',
      md: '',
      lg: 'cn-skeleton-avatar-lg'
    },
    rounded: {
      true: 'cn-skeleton-avatar-rounded',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    rounded: false
  }
})

export interface SkeletonAvatarProps {
  size: VariantProps<typeof skeletonAvatarVariants>['size']
  rounded?: boolean
  className?: string
}

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'md', rounded = false, className, ...props }, ref) => {
    return <SkeletonBase className={cn(skeletonAvatarVariants({ size, rounded }), className)} ref={ref} {...props} />
  }
)

SkeletonAvatar.displayName = 'SkeletonAvatar'
