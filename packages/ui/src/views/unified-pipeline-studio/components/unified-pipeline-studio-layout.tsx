import { ReactElement, ReactNode } from 'react'

import { cn } from '@/utils'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/resizable'

export const HEADER_HEIGHT = 55

const PipelineStudioLayout = {
  Root: ({ children, className }: { children: ReactNode; className?: string }) => {
    return <div className={cn('flex grow flex-col', className)}>{children}</div>
  },
  Header: ({ isYamlView, children }: { isYamlView?: boolean; children: JSX.Element | JSX.Element[] | string }) => {
    const className = isYamlView ? 'border-b' : 'border-b-transparent'
    return (
      <div
        className={cn(`absolute left-0 right-0 z-[1000] flex items-center justify-between px-5`, className)}
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
  SplitMain: ({ children }: { children: ReactElement }) => {
    return (
      <ResizablePanel order={1} className="flex">
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
