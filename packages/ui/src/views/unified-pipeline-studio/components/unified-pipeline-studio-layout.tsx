import { ReactElement, ReactNode } from 'react'

import { cn } from '@/utils'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/resizable'

const HEADER_HEIGHT = 55

const PipelineStudioLayout = {
  Root: ({ children, className }: { children: ReactNode; className?: string }) => {
    return <div className={cn('flex grow flex-col', className)}>{children}</div>
  },
  Header: ({ floating, children }: { floating?: boolean; children: JSX.Element | JSX.Element[] | string }) => {
    const className = floating ? 'absolute left-0 right-0 z-[1000] border-b-transparent' : ''
    return (
      <div
        className={cn(`flex items-center justify-between px-5 border-b`, className)}
        style={{ height: `${HEADER_HEIGHT}px`, minHeight: `${HEADER_HEIGHT}px` }}
      >
        {children}
      </div>
    )
  },
  HeaderLeft: ({ children }: { children: JSX.Element | (JSX.Element | null)[] | string }) => {
    return <div className="flex items-center gap-x-3">{children}</div>
  },
  View: ({ children }: { children: ReactElement }) => {
    return <div>{children}</div>
  },
  Split: ({ children }: { children: ReactElement[] }) => {
    return (
      <ResizablePanelGroup direction="vertical" className="border-5 grow">
        {children}
      </ResizablePanelGroup>
    )
  },
  SplitMain: ({ floating, children }: { floating?: boolean; children: ReactElement }) => {
    return (
      <ResizablePanel order={1} className="flex" style={{ paddingTop: `${floating ? HEADER_HEIGHT : 0}px` }}>
        {children}
      </ResizablePanel>
    )
  },
  SplitPanel: ({ children, open }: { children: ReactElement; open?: boolean }) => {
    return open ? (
      <>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} id="panel" minSize={10} maxSize={90} order={2} className="h-full">
          {children}
        </ResizablePanel>
      </>
    ) : null
  }
}

export default PipelineStudioLayout
