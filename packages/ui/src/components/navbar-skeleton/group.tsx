import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

export interface GroupProps extends PropsWithChildren {
  title?: string
  topBorder?: boolean
  isSubMenu?: boolean
  titleClassName?: string
  className?: string
}

export function Group({ children, title, topBorder, isSubMenu = false, titleClassName, className }: GroupProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col px-5',
        { 'border-borders-5 border-t pt-2.5': topBorder },
        isSubMenu ? 'pb-2.5' : 'gap-1.5 pb-3',
        className
      )}
    >
      {title && (
        <div className={cn('text-foreground-7 mt-1.5', isSubMenu ? 'mb-3' : 'mb-2.5', titleClassName)}>
          <p className="text-xs font-normal">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}
