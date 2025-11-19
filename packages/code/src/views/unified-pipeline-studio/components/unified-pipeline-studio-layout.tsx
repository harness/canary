import { ReactElement, ReactNode } from 'react'

import { Resizable } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

export const HEADER_HEIGHT = 55

const PipelineStudioLayout = {
  Root: ({ children, className }: { children: ReactNode; className?: string }) => {
    return <div className={cn('flex grow flex-col', className)}>{children}</div>
  },
  Header: ({ isYamlView, children }: { isYamlView?: boolean; children: JSX.Element | JSX.Element[] | string }) => {
    const className = isYamlView ? 'border-b' : 'border-b-transparent'
    return (
      <div
        className={cn(`absolute left-0 right-0 z-40 flex items-center justify-between px-cn-lg`, className)}
        style={{ height: `${HEADER_HEIGHT}px`, minHeight: `${HEADER_HEIGHT}px` }}
      >
        {children}
      </div>
    )
  },
  HeaderLeft: ({ children }: { children: JSX.Element | (JSX.Element | null)[] | string }) => {
    return <div className="flex items-center gap-x-cn-sm">{children}</div>
  },
  HeaderRight: ({ children }: { children: JSX.Element | (JSX.Element | null)[] | string }) => {
    return <div className="flex items-center gap-x-cn-sm">{children}</div>
  },
  View: ({ children }: { children: ReactElement }) => {
    return <div>{children}</div>
  },
  Split: ({ children }: { children: ReactElement[] }) => {
    return (
      <Resizable.PanelGroup direction="vertical" className="grow">
        {children}
      </Resizable.PanelGroup>
    )
  },
  SplitMain: ({ children }: { children: ReactElement }) => {
    return (
      <Resizable.Panel order={1} className="flex">
        {children}
      </Resizable.Panel>
    )
  },
  SplitDivider: ({ children }: { children: ReactNode }) => {
    return (
      <div style={{ height: 80, minHeight: 80 }} className="border-cn-2 px-cn-md flex items-center border-t">
        {children}
      </div>
    )
  },
  SplitPanel: ({ children, open, defaultSize }: { children: ReactElement; open?: boolean; defaultSize?: number }) => {
    return open ? (
      <>
        <Resizable.Handle />
        <Resizable.Panel
          defaultSize={defaultSize ?? 30}
          id="panel"
          minSize={10}
          maxSize={90}
          order={2}
          className="h-full"
        >
          {children}
        </Resizable.Panel>
      </>
    ) : null
  }
}

export default PipelineStudioLayout
