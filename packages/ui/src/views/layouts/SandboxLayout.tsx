import { CSSProperties, ReactNode } from 'react'

import { cn } from '@utils/cn'

interface ColumnsProps {
  children: ReactNode
  className?: string
  columnWidths?: string
}

function Root({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen" role="main">
      {children}
    </main>
  )
}

function LeftPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav
      className={cn('border-borders-5 fixed bottom-0 left-0 top-0 z-50 w-[220px] overflow-y-auto border-r', className)}
      aria-label="Left Navigation Panel"
    >
      {children}
    </nav>
  )
}

function LeftSubPanel({
  children,
  hasHeader,
  hasSubHeader,
  className
}: {
  children: ReactNode
  hasHeader?: boolean
  hasSubHeader?: boolean
  className?: string
}) {
  const paddingTopClass =
    hasHeader && hasSubHeader ? 'top-[100px]' : hasHeader ? 'top-[55px]' : hasSubHeader ? 'top-[45px]' : ''

  return (
    <section
      className={cn(
        'border-borders-4 fixed bottom-0 left-[220px] top-0 z-40 w-[300px] overflow-y-auto border-r',
        paddingTopClass,
        className
      )}
      aria-label="Left Sub Navigation Panel"
    >
      {children}
    </section>
  )
}

function Header({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header className={cn('bg-background fixed left-[220px] right-0 top-0 z-40 h-[55px]', className)} role="banner">
      {children}
    </header>
  )
}

function SubHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header className={cn('bg-background-1 fixed left-[220px] right-0 top-[58px] z-40 h-[45px]', className)}>
      {children}
    </header>
  )
}

function Main({
  children,
  fullWidth,
  className,
  hasHeader,
  hasSubHeader,
  hasLeftPanel,
  hasLeftSubPanel,
  leftSubPanelWidth = 300
}: {
  children: ReactNode
  fullWidth?: boolean
  className?: string
  hasHeader?: boolean
  hasSubHeader?: boolean
  hasLeftPanel?: boolean
  hasLeftSubPanel?: boolean
  leftSubPanelWidth?: number
}) {
  const paddingTopClass =
    hasHeader && hasSubHeader ? `pt-[calc(55px+45px)]` : hasHeader ? 'pt-[55px]' : hasSubHeader ? 'pt-[45px]' : ''

  const paddingLeftStyle: CSSProperties = {
    paddingLeft:
      hasLeftPanel && hasLeftSubPanel
        ? `calc(220px + ${leftSubPanelWidth}px)`
        : hasLeftPanel
          ? '220px'
          : hasLeftSubPanel
            ? `${leftSubPanelWidth}px`
            : ''
  }

  if (fullWidth) {
    return (
      <section
        aria-label="Main Content"
        className={cn('h-full', 'bg-background-1', paddingTopClass, className)}
        style={paddingLeftStyle}
      >
        {children}
      </section>
    )
  }

  return (
    <section className="h-full bg-background-1" aria-label="Main Content" style={paddingLeftStyle}>
      <div className={cn('mx-auto h-full max-w-[1200px]', paddingTopClass, className)}>{children}</div>
    </section>
  )
}

interface ContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
}

function Content({ children, maxWidth, className }: ContentProps) {
  const widthClass = maxWidth ? `max-w-${maxWidth} mx-auto` : ''

  return <div className={cn('px-6 py-4 pb-20', widthClass, className)}>{children}</div>
}

function Columns({ children, className, columnWidths = 'repeat(2, 1fr)' }: ColumnsProps) {
  return (
    <div
      className={cn('grid grid-flow-col', className)}
      style={{ gridTemplateColumns: columnWidths }}
      role="grid"
      aria-label="Column Layout"
    >
      {children}
    </div>
  )
}

function Column({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('', className)} role="gridcell">
      {children}
    </div>
  )
}

export { Root, LeftPanel, LeftSubPanel, Header, SubHeader, Main, Content, Columns, Column }
