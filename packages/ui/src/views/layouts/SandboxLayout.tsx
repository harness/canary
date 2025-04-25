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
    <div className="sticky top-0 z-50 h-screen">
      <nav
        className={cn('h-full w-[220px] border-cn-borders-3 max-md:hidden', className)}
        aria-label="Left Navigation Panel"
      >
        {children}
      </nav>
    </div>
  )
}

function LeftSubPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn('border-cn-borders-4 w-[300px] h-full overflow-y-auto border-r', className)}
      aria-label="Left Sub Navigation Panel"
    >
      {children}
    </section>
  )
}

function Header({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header
      className={cn(
        'bg-cn-background fixed translate-x-[--cn-sidebar-width] transition-transform duration-200 ease-linear right-0 top-0 z-40 h-[var(--cn-breadcrumbs-height)]',
        className
      )}
      role="banner"
    >
      {children}
    </header>
  )
}

function SubHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header
      className={cn('min-h-[var(--cn-tabs-nav-height)] max-h-[var(--cn-tabs-nav-height)] overflow-hidden', className)}
    >
      {children}
    </header>
  )
}

function Main({ children, fullWidth, className }: { children: ReactNode; fullWidth?: boolean; className?: string }) {
  return (
    <section
      className={cn(
        'flex flex-col grow w-full bg-cn-background-1 rounded-[inherit]',
        { 'flex-1': fullWidth },
        className
      )}
      aria-label="Main Content"
    >
      {children}
    </section>
  )
}

interface ContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
}

function Content({ children, maxWidth, className }: ContentProps) {
  return (
    <div
      className={cn(
        'px-5 pt-7 pb-11 flex flex-col grow w-full',
        { [`max-w-${maxWidth} mx-auto`]: !!maxWidth },
        className
      )}
    >
      {children}
    </div>
  )
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

const SandboxLayout = { Root, LeftPanel, LeftSubPanel, Header, SubHeader, Main, Content, Columns, Column }
export { SandboxLayout }
