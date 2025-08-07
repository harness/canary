import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

const SkeletonBase = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn('cn-skeleton-base', className)} ref={ref} {...props} />
})

SkeletonBase.displayName = 'SkeletonBase'

export { SkeletonBase }
