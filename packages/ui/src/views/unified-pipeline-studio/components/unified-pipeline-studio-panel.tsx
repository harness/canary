import { Button, Icon, Tabs } from '@components/index'

import { UnifiedPipelineStudioProblemsPanel } from './panel/unified-pipeline-studio-problems-panel'

export const UnifiedPipelineStudioPanel = ({
  setPanelOpen,
  problems
}: {
  setPanelOpen?: (open: boolean) => void
  problems: any
}): JSX.Element => {
  return (
    <Tabs.Root defaultValue="problems" variant="underline" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <Tabs.List className="ml-4 bg-transparent">
          <Tabs.Trigger value="problems">
            Problems
            {/* {problemsCount.all > 0 && (
              <Badge className="ml-2 h-5 rounded-full bg-red-950 p-2 text-2 font-normal text-red-400">
                {problemsCount.all}
              </Badge>
            )} */}
          </Tabs.Trigger>
          <Tabs.Trigger value="console">Console</Tabs.Trigger>
        </Tabs.List>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setPanelOpen?.(false)
            }}
            variant="ghost"
            size="sm"
            className="mx-2 px-2"
          >
            <Icon name="x-mark" />
          </Button>
        </div>
      </div>
      <Tabs.Content value="problems" className="h-full overflow-scroll py-2">
        <UnifiedPipelineStudioProblemsPanel problems={problems} />
      </Tabs.Content>
      <Tabs.Content value="console" className="h-full overflow-scroll py-2">
        <UnifiedPipelineStudioProblemsPanel problems={problems} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
