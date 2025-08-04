import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { IconV2 } from './icon-v2'

interface NodeGroupRootProps {
  className?: string
  children: ReactNode
}

function Root({ className, children }: NodeGroupRootProps) {
  return (
    <div
      className={cn('relative grid grid-cols-[26px_1fr] grid-rows-[auto_1fr] items-center gap-x-3 gap-y-2', className)}
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
    <div className="col-start-1 row-start-1 flex size-full justify-center self-start">
      <div
        className={cn(
          {
            'text-icons-8 shadow-commit-list-bullet': simpleNodeIcon,
            'border-cn-borders-4 bg-cn-background-2 text-icons-8 relative flex h-6 w-6 place-content-center place-items-center rounded-full border p-1 layer-medium':
              !simpleNodeIcon
          },
          className
        )}
      >
        {simpleNodeIcon ? <IconV2 name="circle" size="2xs" /> : <>{children}</>}
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

function Connector({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute bottom-0 left-[4px] top-5 z-10 w-1 border-l border-cn-borders-4', className)}
      data-connector
    />
  )
}

export { Root, Icon, Title, Content, Connector }
