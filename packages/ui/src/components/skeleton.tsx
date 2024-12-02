import { cn } from '@utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-background-3 animate-pulse rounded-3xl', className)} {...props} />
}

export { Skeleton }
