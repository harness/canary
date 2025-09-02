import { forwardRef } from 'react'

import { avatarVariants } from '@/components'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonBase } from './components/skeleton'

const skeletonAvatarVariants: typeof avatarVariants = cva('cn-skeleton-avatar', {
  variants: {
    size: {
      xs: 'cn-skeleton-avatar-xs',
      sm: 'cn-skeleton-avatar-sm',
      md: 'cn-skeleton-avatar-md',
      lg: 'cn-skeleton-avatar-lg'
    },
    rounded: {
      true: 'cn-skeleton-avatar-rounded',
      false: ''
    }
  },
  defaultVariants: {
    size: 'sm',
    rounded: false
  }
})

export interface SkeletonAvatarProps {
  size: VariantProps<typeof skeletonAvatarVariants>['size']
  rounded?: boolean
  className?: string
}

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'sm', rounded = false, className, ...props }, ref) => {
    return <SkeletonBase className={cn(skeletonAvatarVariants({ size, rounded }), className)} ref={ref} {...props} />
  }
)

SkeletonAvatar.displayName = 'SkeletonAvatar'
