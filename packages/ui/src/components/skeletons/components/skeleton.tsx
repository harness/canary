import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
<<<<<<< HEAD
  return <div className={cn('bg-cn-background-3 animate-pulse rounded-3xl', className)} {...props} />
=======
  return <div className={cn('bg-cds-background-3 animate-pulse rounded-3xl', className)} {...props} />
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
}

export { Skeleton }
