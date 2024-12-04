import { cn } from '@utils/cn'

interface NodeGroupRootProps {
  className?: string
  children: React.ReactNode
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
  children?: React.ReactNode
  simpleNodeIcon?: boolean
  className?: string
}) {
  return (
    <div className="col-start-1 row-start-1 self-start">
      <div
        className={cn(
          'border-tertiary-background/30 bg-background text-primary relative z-20 flex h-6 w-6 place-content-center place-items-center rounded-full border p-1',
          { 'bg-transprent border-none': simpleNodeIcon },
          className
        )}
      >
        {simpleNodeIcon ? (
          <div className="bg-primary shadow-primary/10 size-[4px] rounded-[1px] shadow-sm" />
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  )
}

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="col-start-2 row-start-1">
      <div className={cn('inline-flex items-center gap-1.5', className)}>{children}</div>
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="col-start-2 row-start-2">{children}</div>
}

function Connector({ first, last }: { first?: boolean; last?: boolean }) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-[12px] top-0 z-10 w-[1px] border-l',
        { 'top-3': first },
        { 'bottom-8': last }
      )}
    />
  )
}

export { Root, Icon, Title, Content, Connector }
