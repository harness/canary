import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

export interface ContentProps extends PropsWithChildren<unknown> {
  className?: string
}

export function Content({ children, className }: ContentProps) {
  return <div className={cn('flex min-w-0 flex-col', className)}>{children}</div>
}
