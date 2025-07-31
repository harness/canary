import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-[image:var(--cn-comp-skeleton-bg)] animate-pulse rounded-3xl', className)} {...props} />
}

export { Skeleton }
