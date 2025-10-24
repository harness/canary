import { Badge, Button, Icon, Tabs } from '@harnessio/ui/components'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { PipelineStudioProblemsPanel } from './pipeline-studio-problems-panel'

export const PipelineStudioPanel = (): JSX.Element => {
  const {
    state: { problemsCount }
  } = usePipelineDataContext()
  const { setPanelOpen } = usePipelineViewContext()

  return (
    <Tabs.Root defaultValue="problems" variant="underline" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <Tabs.List className="ml-4 bg-transparent">
          <Tabs.Trigger value="problems">
            Problems
            {problemsCount.all > 0 && (
              <Badge className="ml-2 h-5 rounded-full bg-red-950 p-2 text-xs font-normal text-red-400">
                {problemsCount.all}
              </Badge>
            )}
          </Tabs.Trigger>
          {/* <Tabs.Trigger value="suggestions">Suggestions</Tabs.Trigger> */}
        </Tabs.List>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setPanelOpen(false)
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
        <PipelineStudioProblemsPanel />
      </Tabs.Content>
      {/* <Tabs.Content value="suggestions">Suggestions placeholder</Tabs.Content> */}
    </Tabs.Root>
  )
}
