import { FC } from 'react'

import { cn } from '@/utils'

export const SubHeaderWrapper: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'layer-high sticky top-[var(--cn-breadcrumbs-height)] bg-cn-background-1 rounded-[inherit]',
        className
      )}
    >
      {children}
    </div>
  )
}
