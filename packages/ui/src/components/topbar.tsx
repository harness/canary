import * as React from 'react'

import { cx } from 'class-variance-authority'

function isElement(node: React.ReactNode): node is React.ReactElement {
  return (node as React.ReactElement).type !== undefined
}

const Topbar = {
  Root: function Root({ children, className }: { children: React.ReactNode; className?: string }) {
    const hasCenter = React.Children.toArray(children).some(
      (child: React.ReactNode) => isElement(child) && child?.type === Topbar.Center
    )

    // Determine the grid layout based on the presence of Center
    const gridCols = hasCenter ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[1fr_auto]'

    return (
      <div
        className={cx(
          `grid w-full ${gridCols} font-regular h-[55px] items-center gap-6 border-b border-borders-5 px-5 text-sm`,
          className
        )}
      >
        {children}
      </div>
    )
  },

  Left: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="order-1 flex items-center gap-3">{children}</div>
  }),

  Center: React.memo(function Center({ children }: { children: React.ReactNode }) {
    return <div className="order-2 flex items-center justify-center">{children}</div>
  }),

  Right: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="order-3 flex items-center gap-3">{children}</div>
  })
}

export { Topbar }
