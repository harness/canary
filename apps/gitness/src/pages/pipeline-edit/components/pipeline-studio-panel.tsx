import { Badge, Button, Icon, Tabs, TabsContent, TabsList, TabsTrigger } from '@harnessio/canary'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { PipelineStudioProblemsPanel } from './pipeline-studio-problems-panel'

export const PipelineStudioPanel = (): JSX.Element => {
  const {
    state: { problemsCount }
  } = usePipelineDataContext()
  const { setPanelOpen } = usePipelineViewContext()

  return (
    <Tabs defaultValue="problems" variant="underline" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <TabsList className="ml-4 bg-transparent">
          <TabsTrigger value="problems">
            Problems
            {problemsCount.all > 0 && (
              <Badge className="ml-2 h-5 rounded-full bg-red-950 p-2 text-xs font-normal text-red-400">
                {problemsCount.all}
              </Badge>
            )}
          </TabsTrigger>
          {/* <TabsTrigger value="suggestions">Suggestions</TabsTrigger> */}
        </TabsList>
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
      <TabsContent value="problems" className="h-full overflow-scroll py-2">
        <PipelineStudioProblemsPanel />
      </TabsContent>
      {/* <TabsContent value="suggestions">Suggestions placeholder</TabsContent> */}
    </Tabs>
  )
}
