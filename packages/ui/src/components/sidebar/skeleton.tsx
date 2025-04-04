import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-cn-background-accent/10', className)} {...props} />
}

export { Skeleton }
