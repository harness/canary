import React from 'react'
import cx from 'classnames'

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
          `w-full grid ${gridCols} px-5 h-[55px] gap-6 border-b items-center text-sm font-regular`,
          className
        )}>
        {children}
      </div>
    )
  },

  Left: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="flex order-1 gap-3 items-center">{children}</div>
  }),

  Center: React.memo(function Center({ children }: { children: React.ReactNode }) {
    return <div className="flex order-2 justify-center items-center">{children}</div>
  }),

  Right: React.memo(function Header({ children }: { children: React.ReactNode }) {
    return <div className="flex order-3 gap-3 items-center">{children}</div>
  })
}

export { Topbar }
