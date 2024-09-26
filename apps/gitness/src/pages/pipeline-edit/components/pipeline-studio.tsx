import { useCallback, useEffect, useMemo } from 'react'
import { Container, PipelineStudioFooterBar } from '@harnessio/playground'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Sheet, SheetContent } from '@harnessio/canary'
import { PipelineStudioPanel } from './pipeline-studio-panel'
import { PipelineStudioToolbar } from './pipeline-studio-toolbar'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { PipelineStudioView } from '../types/types'
import { PipelineStudioStepForm } from './pipeline-studio-step-form'
import { PipelineStudioGraphView } from './pipeline-studio-graph-view'
import { PipelineStudioYamlView } from './pipeline-studio-yaml-view'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { PipelineStudioStepPalette } from './pipeline-studio-step-palette'
import PipelineStudioHeaderActions from './pipeline-studio-header-actions'
import { timeAgo } from '../utils/time-utils'

export default function PipelineEdit() {
  const { view, setView, panelOpen, stepDrawerOpen, setStepDrawerOpen, setPanelOpen } = usePipelineViewContext()
  const { problems } = usePipelineDataContext()

  const { clearAddStepIntention, clearEditStepIntention, setCurrentStepFormDefinition, latestCommitAuthor } =
    usePipelineDataContext()

  useEffect(() => {
    setPanelOpen(view === 'yaml')
  }, [view])

  const main = useMemo(() => {
    return (
      <>
        <ResizablePanelGroup direction="vertical" className="border-5">
          <ResizablePanel order={1}>
            {view === 'visual' ? (
              <PipelineStudioGraphView />
            ) : (
              <PipelineStudioYamlView /> // TODO check this prop: setDrawerOpen={setStepDrawerOpen}
            )}
          </ResizablePanel>
          {panelOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} id="panel" minSize={10} maxSize={90} order={2} className="h-full">
                <PipelineStudioPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </>
    )
  }, [panelOpen, view])

  const renderSheetContent = useCallback(() => {
    switch (stepDrawerOpen) {
      case StepDrawer.Collection:
        return (
          <PipelineStudioStepPalette
            requestClose={() => {
              setStepDrawerOpen(StepDrawer.None)
              clearAddStepIntention()
              clearEditStepIntention()
              setCurrentStepFormDefinition(null)
            }}
          />
        )
      case StepDrawer.Form:
        return (
          <PipelineStudioStepForm
            requestClose={() => {
              setStepDrawerOpen(StepDrawer.None)
              clearAddStepIntention()
              clearEditStepIntention()
              setCurrentStepFormDefinition(null)
            }}
          />
        )
      default:
        return null
    }
  }, [stepDrawerOpen])

  const drawer = useMemo(
    () => (
      <Sheet
        open={stepDrawerOpen !== StepDrawer.None}
        onOpenChange={open => {
          if (!open) {
            setStepDrawerOpen(StepDrawer.None)
            clearAddStepIntention()
            clearEditStepIntention()
            setCurrentStepFormDefinition(null)
          }
        }}>
        <SheetContent onOpenAutoFocus={e => e.preventDefault()} hideCloseButton={true} className="p-0">
          {renderSheetContent()}
        </SheetContent>
      </Sheet>
    ),
    [stepDrawerOpen, setStepDrawerOpen]
  )

  return (
    <Container.Root wFull={true} hFull={true} className="h-[calc(100vh-100px)]">
      <Container.Main>
        <div>
          <PipelineStudioHeaderActions />
          <PipelineStudioToolbar view={view} setView={view => setView(view as PipelineStudioView)} />
        </div>
        {drawer}
        {main}
        {latestCommitAuthor ? (
          <PipelineStudioFooterBar
            commitHistory={{
              lastCommittedAt: latestCommitAuthor.when ? timeAgo(latestCommitAuthor.when) : '',
              lastCommittedBy: latestCommitAuthor.identity?.name ?? ''
            }}
            problems={problems.problemsCount}
            togglePane={() => setPanelOpen(!panelOpen)}
          />
        ) : null}
      </Container.Main>
    </Container.Root>
  )
}
