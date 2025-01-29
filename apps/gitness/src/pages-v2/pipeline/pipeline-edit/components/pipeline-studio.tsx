import { useCallback, useEffect, useMemo } from 'react'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Sheet, SheetContent } from '@harnessio/canary'
import { useListBranchesQuery } from '@harnessio/code-service-client'
import { getInitials, PipelineStudioFooterBar } from '@harnessio/views'

import { useExitPrompt } from '../../../../framework/hooks/useExitPrompt'
import { useGetRepoRef } from '../../../../framework/hooks/useGetRepoPath'
import { timeAgoFromISOTime } from '../../../../pages/pipeline-edit/utils/time-utils'
import { getTrimmedSha } from '../../../../utils/git-utils'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { PipelineStudioView } from '../types/types'
import { PipelineStudioGraphView } from './pipeline-studio-graph-view'
import PipelineStudioHeaderActions from './pipeline-studio-header-actions'
import { PipelineStudioPanel } from './pipeline-studio-panel'
import { PipelineStudioStepForm } from './pipeline-studio-step-form'
import { PipelineStudioStepPalette } from './pipeline-studio-step-palette'
import { PipelineStudioToolbar } from './pipeline-studio-toolbar'
import { PipelineStudioYamlView } from './pipeline-studio-yaml-view'

export default function PipelineEdit() {
  const { view, setView, panelOpen, stepDrawerOpen, setStepDrawerOpen, setPanelOpen } = usePipelineViewContext()
  const {
    state: { problemsCount, pipelineFileContent, fetchingPipelineFileContent, currentBranch, isDirty },
    clearAddStepIntention,
    clearEditStepIntention,
    setFormStep,
    setCurrentBranch
  } = usePipelineDataContext()

  const { confirmExit } = useExitPrompt({
    isDirty
  })

  const latestCommitAuthor = pipelineFileContent?.latest_commit?.author

  useEffect(() => {
    setPanelOpen(view === 'yaml')
  }, [view])

  // TODO: should we move this in data provider?
  const repoRef = useGetRepoRef()
  const { data: { body: listBranchesData } = {}, isLoading: listBranchesLoading } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {}
  })
  const branchesNames = useMemo(() => listBranchesData?.map(branch => branch.name ?? ''), [listBranchesData]) ?? []

  const main = useMemo(() => {
    return (
      <>
        <ResizablePanelGroup direction="vertical" className="border-5">
          <ResizablePanel order={1}>
            {view === 'visual' ? <PipelineStudioGraphView /> : <PipelineStudioYamlView />}
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
              setFormStep(null)
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
              setFormStep(null)
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
            setFormStep(null)
          }
        }}
      >
        <SheetContent
          onOpenAutoFocus={e => e.preventDefault()}
          hideCloseButton={true}
          className="max-w-lg p-0 sm:max-w-lg"
        >
          {renderSheetContent()}
        </SheetContent>
      </Sheet>
    ),
    [stepDrawerOpen, setStepDrawerOpen]
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 54px)' }}>
      <div>
        <PipelineStudioHeaderActions />
        <PipelineStudioToolbar view={view} setView={view => setView(view as PipelineStudioView)} />
      </div>
      {drawer}
      {main}
      <PipelineStudioFooterBar
        lastCommitInfo={{
          authorName: latestCommitAuthor?.identity?.name ?? '',
          committedTimeAgo: latestCommitAuthor?.when ? timeAgoFromISOTime(latestCommitAuthor.when) : '',
          authorInitials: getInitials(latestCommitAuthor?.identity?.name ?? ''),
          commitMessage: pipelineFileContent?.latest_commit?.message,
          commitSha: getTrimmedSha(pipelineFileContent?.latest_commit?.sha ?? '')
        }}
        currentBranch={currentBranch}
        branches={branchesNames}
        branchesLoading={listBranchesLoading || fetchingPipelineFileContent}
        onBranchChange={branch => confirmExit().then(confirmed => confirmed && setCurrentBranch(branch))}
        problems={problemsCount}
        togglePane={() => setPanelOpen(!panelOpen)}
      />
    </div>
  )
}
