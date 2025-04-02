import { cn } from '@harnessio/canary'

function Root({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen" role="main">
      {children}
    </main>
  )
}

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn('bg-background fixed left-[220px] right-0 top-0 z-40 h-[55px]', className)} role="banner">
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
  hasLeftSubPanel
}: {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
  hasHeader?: boolean
  hasSubHeader?: boolean
  hasLeftPanel?: boolean
  hasLeftSubPanel?: boolean
}) {
  const paddingTopClass =
    hasHeader && hasSubHeader ? `pt-[calc(55px+45px)]` : hasHeader ? 'pt-[55px]' : hasSubHeader ? 'pt-[45px]' : ''

  const paddingLeftClass =
    hasLeftPanel && hasLeftSubPanel
      ? 'pl-[calc(220px+300px)]'
      : hasLeftPanel
        ? 'pl-[220px]'
        : hasLeftSubPanel
          ? 'pl-[300px]'
          : ''

  if (fullWidth) {
    return (
      <section aria-label="Main Content" className={cn('h-full', paddingLeftClass, paddingTopClass, className)}>
        {children}
      </section>
    )
  }

  return (
    <section aria-label="Main Content" className={cn('h-full', paddingLeftClass)}>
      <div className={cn('mx-auto h-full max-w-[1200px]', paddingTopClass, className)}>{children}</div>
    </section>
  )
}

interface ContentProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
}

function Content({ children, maxWidth, className }: ContentProps) {
  const widthClass = maxWidth ? `max-w-${maxWidth} mx-auto` : ''

  return <div className={cn('px-8 py-5 pb-24', widthClass, className)}>{children}</div>
}

export { Root, Header, Main, Content }
