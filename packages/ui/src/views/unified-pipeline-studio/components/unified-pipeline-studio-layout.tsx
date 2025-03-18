import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/resizable'

const PipelineStudioLayout = {
  Root: ({ children }: { children: React.ReactNode }) => {
    return <div className="flex grow flex-col">{children}</div>
  },
  Header: ({ children }: { children: JSX.Element | JSX.Element[] | string }) => {
    return <div className="flex h-[55px] items-center justify-between border-b px-5">{children}</div>
  },
  HeaderLeft: ({ children }: { children: JSX.Element | JSX.Element[] | string }) => {
    return <div className="flex items-center gap-x-3">{children}</div>
  },
  View: ({ children }: { children: React.ReactElement }) => {
    return <div>{children}</div>
  },
  Split: ({ children }: { children: React.ReactElement[] }) => {
    return (
      <ResizablePanelGroup direction="vertical" className="border-5 grow">
        {children}
      </ResizablePanelGroup>
    )
  },
  SplitMain: ({ children }: { children: React.ReactElement }) => {
    return (
      <ResizablePanel order={1} className="flex">
        {children}{' '}
      </ResizablePanel>
    )
  },
  SplitPanel: ({ children, open }: { children: React.ReactElement; open?: boolean }) => {
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
