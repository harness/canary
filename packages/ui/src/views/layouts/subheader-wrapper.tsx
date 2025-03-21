import { FC } from 'react'

// import { useTheme } from '@/context'
import { cn } from '@/utils'

export const SubHeaderWrapper: FC = ({ children }) => {
  // const { isInset } = useTheme()
  return <div className={cn('layer-high sticky top-0 bg-background-1')}>{children}</div>
}
