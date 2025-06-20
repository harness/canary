import { Button, IconV2, Tabs } from '@components/index'

import { UnifiedPipelineStudioProblemsPanel } from './panel/unified-pipeline-studio-problems-panel'

export const UnifiedPipelineStudioPanel = ({
  setPanelOpen,
  problems
}: {
  setPanelOpen?: (open: boolean) => void
  problems: any
}): JSX.Element => {
  return (
    <Tabs.Root defaultValue="problems" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <Tabs.List className="ml-4">
          <Tabs.Trigger value="problems">Problems</Tabs.Trigger>
          <Tabs.Trigger value="console">Console</Tabs.Trigger>
        </Tabs.List>
        <Button onClick={() => setPanelOpen?.(false)} variant="ghost" size="sm" className="mx-2 px-2">
          <IconV2 name="xmark" />
        </Button>
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
