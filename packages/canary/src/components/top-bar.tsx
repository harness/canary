import React from 'react'

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-[1fr_auto] px-8 h-[55px] gap-6 border-b border-border-background items-center text-sm font-regular">
      {children}
    </div>
  )
}

function Left({ children }: { children: React.ReactNode }) {
  return <div className="flex order-1 gap-3">{children}</div>
}

function Right({ children }: { children: React.ReactNode }) {
  return <div className="flex order-2 gap-3">{children}</div>
}

export { Root, Left, Right }
