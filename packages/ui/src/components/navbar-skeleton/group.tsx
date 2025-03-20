import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

export interface GroupProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  title?: string
  topBorder?: boolean
  isSubMenu?: boolean
  titleClassName?: string
  className?: string
  isMainNav?: boolean
}

export function Group({
  children,
  title,
  topBorder,
  isSubMenu = false,
  isMainNav = false,
  titleClassName,
  className
}: GroupProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col px-2',
        { 'border-borders-5 border-t pt-2.5': topBorder },
        { 'border-sidebar-border-1': topBorder && isMainNav },
        isSubMenu ? 'pb-2.5 gap-y-0.5' : 'gap-1 pb-3',
        className
      )}
    >
      {title && (
        <div
          className={cn(
            'text-foreground-7 mt-1.5',
            { 'text-sidebar-foreground-5': isMainNav },
            isSubMenu ? 'mb-3' : 'mb-1.5',
            titleClassName
          )}
        >
          <p className="px-2.5 text-xs font-normal">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}
