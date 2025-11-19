import { FC } from 'react'

import { cn } from '@harnessio/ui/utils'

export const SubHeaderWrapper: FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={cn('bg-cn-1 rounded-inherit', className)}>{children}</div>
}
