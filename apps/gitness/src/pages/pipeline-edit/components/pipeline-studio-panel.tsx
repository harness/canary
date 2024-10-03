import { Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, Icon } from '@harnessio/canary'
import { PipelineStudioProblemsPanel } from './pipeline-studio-problems-panel'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { usePipelineViewContext } from '../context/PipelineStudioViewProvider'

export const PipelineStudioPanel = (): JSX.Element => {
  const {
    state: { problemsCount }
  } = usePipelineDataContext()
  const { setPanelOpen } = usePipelineViewContext()

  return (
    <Tabs defaultValue="problems" variant="underline" className="h-full">
      <div className="flex flex-row justify-between border-b">
        <TabsList className="bg-transparent ml-4">
          <TabsTrigger value="problems">
            Problems
            {problemsCount.all > 0 && (
              <Badge className="rounded-full font-normal text-xs p-2 h-5 ml-2 bg-red-950 text-red-400">
                {problemsCount.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setPanelOpen(false)
            }}
            variant="ghost"
            size="sm"
            className="mx-2 px-2">
            <Icon name="x-mark" />
          </Button>
        </div>
      </div>
      <TabsContent value="problems" className="overflow-scroll h-full py-2">
        <PipelineStudioProblemsPanel />
      </TabsContent>
      <TabsContent value="suggestions">Suggestions placeholder</TabsContent>
    </Tabs>
  )
}
