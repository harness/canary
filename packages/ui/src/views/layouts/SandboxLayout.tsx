import { ReactNode } from 'react'

import { cn } from '@utils/cn'

interface ColumnsProps {
  children: ReactNode
  className?: string
  columnWidths?: string
}

function Root({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-[auto_1fr]" role="main">
      {children}
    </main>
  )
}

function LeftPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="sticky top-0 h-screen">
      <nav className={cn('h-full w-[220px] border-borders-5', className)} aria-label="Left Navigation Panel">
        {children}
      </nav>
    </div>
  )
}

function LeftSubPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn('border-borders-4 w-[300px] h-full overflow-y-auto border-r', className)}
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
  return <header className={className}>{children}</header>
}

function Main({ children, fullWidth, className }: { children: ReactNode; fullWidth?: boolean; className?: string }) {
  if (fullWidth) {
    return (
      <section aria-label="Main Content" className={cn('h-full w-full bg-background-1 overflow-auto', className)}>
        {children}
      </section>
    )
  }

  return (
    <section className="size-full overflow-auto bg-background-1" aria-label="Main Content">
      <div className={cn('mx-auto h-full max-w-[1200px]', className)}>{children}</div>
    </section>
  )
}

interface ContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
  paddingClassName?: string
}

function Content({ children, maxWidth, className, paddingClassName = 'px-5 pt-5 pb-11' }: ContentProps) {
  const widthClass = maxWidth ? `max-w-${maxWidth} mx-auto` : ''

  return <div className={cn(paddingClassName, widthClass, className)}>{children}</div>
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
