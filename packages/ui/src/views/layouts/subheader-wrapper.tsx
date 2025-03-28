import { FC } from 'react'

import { cn } from '@/utils'

export const SubHeaderWrapper: FC = ({ children }) => {
  return <div className={cn('layer-high sticky top-0 bg-cn-background-1')}>{children}</div>
}
