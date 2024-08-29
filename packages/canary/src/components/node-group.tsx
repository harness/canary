import React from 'react'
import { cn } from '@/lib/utils'

interface NodeGroupRootProps {
  className?: string
  children: React.ReactNode
}

function Root({ className, children }: NodeGroupRootProps) {
  return (
    <div
      className={cn(
        'relative grid items-center grid-cols-[26px_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2 pb-8',
        className
      )}>
      {children}
    </div>
  )
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-start-1 row-start-1">
      <div className="relative z-20 h-6 w-6 rounded-full flex place-content-center place-items-center p-1 border border-tertiary-background/30 bg-background text-primary">
        {children}
      </div>
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-start-2 row-start-1">
      <div className="inline-flex gap-1.5 items-center">{children}</div>
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="col-start-2 row-start-2">{children}</div>
}

function Connector() {
  return <div className="z-10 absolute left-[12px] top-0 bottom-0 w-[1px] border-l" />
}

export { Root, Icon, Title, Content, Connector }
