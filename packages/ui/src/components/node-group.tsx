import { ReactNode } from 'react'

import { cn } from '@utils/cn'

interface NodeGroupRootProps {
  className?: string
  children: ReactNode
}

function Root({ className, children }: NodeGroupRootProps) {
  return (
    <div
      className={cn(
        'relative grid grid-cols-[26px_1fr] grid-rows-[auto_1fr] items-center gap-x-3 gap-y-2 pb-8',
        className
      )}
    >
      {children}
    </div>
  )
}

function Icon({
  children,
  simpleNodeIcon,
  className
}: {
  children?: ReactNode
  simpleNodeIcon?: boolean
  className?: string
}) {
  return (
    <div className="col-start-1 row-start-1 self-start">
      <div
        className={cn(
          'border-cn-borders-4 bg-cn-background-2 text-icons-8 relative flex h-6 w-6 place-content-center place-items-center rounded-full border p-1 layer-medium',
          { 'bg-transparent border-none size-1 p-0 mt-2 shadow-commit-list-bullet': simpleNodeIcon },
          className
        )}
      >
        {simpleNodeIcon ? <div className="size-1 rounded-[1px] bg-icons-8" /> : <>{children}</>}
      </div>
    </div>
  )
}

function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="col-start-2 row-start-1">
      <div className={cn('inline-flex items-center gap-1.5', className)}>{children}</div>
    </div>
  )
}

function Content({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('col-start-2 row-start-2', className)}>{children}</div>
}

function Connector({ first, last, className }: { first?: boolean; last?: boolean; className?: string }) {
  return (
    <div
      className={cn('absolute bottom-0 left-2.5 top-0 z-10 w-1', { 'top-3': first }, { 'bottom-8': last }, className)}
      data-connector
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-cn-borders-4" />
    </div>
  )
}

export { Root, Icon, Title, Content, Connector }
