import { SidebarRail2 } from '@harnessio/ui/components'

export const SidebarExpandCollapseWrapper = () => {
  return (
    <SidebarRail2
      left={
        <div className="flex items-center justify-center h-full w-full">
          <h1>Left</h1>
        </div>
      }
      right={
        <div className="flex items-center justify-center h-full w-full">
          <h1>Right</h1>
        </div>
      }
    />
  )
}
