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
      className={cn(
        'relative grid grid-cols-[28px_1fr] grid-rows-[auto_1fr] items-center gap-x-cn-xs gap-y-cn-3xs',
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
  className,
  wrapperClassName
}: {
  children?: ReactNode
  simpleNodeIcon?: boolean
  className?: string
  wrapperClassName?: string
}) {
  return (
    <div className={cn('col-start-1 row-start-1 size-full self-start', wrapperClassName)}>
      <div
        className={cn(
          {
            'text-cn-1': simpleNodeIcon,
            'border-cn-3 bg-cn-2 text-cn-1 relative size-7 flex place-content-center place-items-center rounded-cn-full border layer-medium':
              !simpleNodeIcon
          },
          className
        )}
      >
        {simpleNodeIcon ? <IconV2 name="circle" size="xs" /> : <>{children}</>}
      </div>
    </div>
  )
}

function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="col-start-2 row-start-1">
      <div className={cn('inline-flex items-center gap-cn-2xs', className)}>{children}</div>
    </div>
  )
}

function Content({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('col-start-2 row-start-2', className)}>{children}</div>
}

function Connector({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute bottom-0 left-[0.8rem] top-cn-lg z-10 w-1 border-l border-cn-3', className)}
      data-connector
    />
  )
}

export { Root, Icon, Title, Content, Connector }
