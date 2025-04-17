import { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

export interface RootProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  className?: string
  isSubMenu?: boolean
}

export function Root({ className, children, isSubMenu = false }: RootProps) {
  return (
    <div
      className={cn(
        'relative border-sidebar-border-1 bg-cn-background-0 grid h-screen w-[220px] select-none grid-rows-[auto_1fr_auto] overflow-y-auto border-r',
        { 'bg-sidebar-background-6 backdrop-blur-[20px]': isSubMenu },
        className
      )}
    >
      {children}
    </div>
  )
}
