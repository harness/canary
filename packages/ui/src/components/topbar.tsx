import * as React from 'react'

import { cn } from '@/utils'

function isElement(node: React.ReactNode): node is React.ReactElement {
  return (node as React.ReactElement).type !== undefined
}

const Topbar = {
  Root: function Root({ children, className }: { children: React.ReactNode; className?: string }) {
    const hasCenter = React.Children.toArray(children).some(
      (child: React.ReactNode) => isElement(child) && child?.type === Topbar.Center
    )

    return (
      <div
        className={cn(
          `grid w-full grid-cols-[1fr_auto] font-regular h-[var(--cn-breadcrumbs-height)] items-center gap-cn-xl px-cn-2xl text-cn-size-2`,
          { 'grid-cols-[auto_1fr_auto]': hasCenter },
          className
        )}
      >
        {children}
      </div>
    )
  },

  Left: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="order-1 flex items-center gap-cn-sm">{children}</div>
  }),

  Center: React.memo(function Center({ children }: { children: React.ReactNode }) {
    return <div className="order-2 flex items-center justify-center">{children}</div>
  }),

  Right: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="order-3 flex items-center gap-cn-sm">{children}</div>
  })
}

export { Topbar }
