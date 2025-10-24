import { PropsWithChildren } from 'react'

import { cn } from '@utils/cn'

export interface RootProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  className?: string
  isSubMenu?: boolean
}

export function Root({ className, children, isSubMenu = false }: RootProps) {
  return (
    <div
      className={cn(
        'relative border-borders-5 bg-background-7 grid h-screen w-[220px] select-none grid-rows-[auto_1fr_auto] overflow-y-auto border-r',
        { 'bg-background-7/70 backdrop-blur-[20px]': isSubMenu },
        className
      )}
    >
      {children}
    </div>
  )
}
