import * as React from 'react'

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-regular border-border-background grid h-[55px] w-full grid-cols-[1fr_auto] items-center gap-6 border-b px-8 text-sm">
      {children}
    </div>
  )
}

function Left({ children }: { children: React.ReactNode }) {
  return <div className="order-1 flex gap-3">{children}</div>
}

function Right({ children }: { children: React.ReactNode }) {
  return <div className="order-2 flex gap-3">{children}</div>
}

export { Root, Left, Right }
