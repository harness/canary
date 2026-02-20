import { Button, Checkbox, FileToolbarActions, IconV2 } from '@harnessio/ui/components'
import { noop } from 'lodash-es'

import { YamlEditorContextProvider } from '@harnessio/yaml-editor'

import { UnifiedPipelinePipelineConfigDrawer } from './components/unified-pipeline-pipeline-config-drawer'
import { UnifiedPipelineStageConfigDrawer } from './components/unified-pipeline-stage-config-drawer'
import { UnifiedPipelineStepDrawer } from './components/unified-pipeline-step-drawer'
import { UnifiedPipelineStudioFooter } from './components/unified-pipeline-studio-footer'
import PipelineStudioView from './components/unified-pipeline-studio-internal'
import PipelineStudioLayout from './components/unified-pipeline-studio-layout'
import { UnifiedPipelineStudioPanel } from './components/unified-pipeline-studio-panel'
import { VisualYamlToggle } from './components/visual-yaml-toggle'
import { useUnifiedPipelineStudioContext } from './context/unified-pipeline-studio-context'
import { RightDrawer } from './types/right-drawer-types'

export const PipelineStudioInternal = (): JSX.Element => {
  const {
    view,
    setView,
    errors,
    onPanelOpenChange,
    panelOpen,
    yamlRevision,
    onDownloadYaml,
    onSave,
    onRun,
    saveInProgress,
    isYamlDirty,
    hideSaveBtn,
    lastCommitInfo,
    splitView,
    setSplitView,
    setRightDrawer,
    setEditPipelineIntention
  } = useUnifiedPipelineStudioContext()

  return (
    <YamlEditorContextProvider>
      <PipelineStudioLayout.Root>
        <PipelineStudioLayout.Header isYamlView={view === 'yaml'}>
          <PipelineStudioLayout.HeaderLeft>
            <VisualYamlToggle view={view} setView={setView} isYamlValid={errors.isYamlValid} />
            {view === 'visual' ? (
              <Checkbox
                checked={splitView}
                label="Split view"
                onCheckedChange={value => {
                  setSplitView?.(!!value)
                }}
              />
            ) : null}
          </PipelineStudioLayout.HeaderLeft>

          <PipelineStudioLayout.HeaderRight>
            <Button
              size="sm"
              variant="outline"
              iconOnly
              aria-label="Edit pipeline"
              onClick={() => {
                setEditPipelineIntention({ path: 'pipeline' })
                setRightDrawer(RightDrawer.PipelineConfig)
              }}
              tooltipProps={{ content: 'Edit pipeline' }}
            >
              <IconV2 name="edit-pencil" />
            </Button>
            {view === 'yaml' ? (
              <FileToolbarActions
                onDownloadClick={() => {
                  onDownloadYaml(yamlRevision.yaml)
                }}
                copyContent={yamlRevision.yaml}
                onEditClick={noop}
              />
            ) : null}
            {!hideSaveBtn ? (
              <>
                <Button
                  loading={saveInProgress}
                  size="sm"
                  onClick={() => onSave(yamlRevision.yaml)}
                  disabled={!isYamlDirty}
                >
                  {!saveInProgress && !isYamlDirty && <IconV2 name="check" className="cn-text-success" />}
                  Save
                </Button>
                <Button size="sm" onClick={() => onRun()} disabled={isYamlDirty || saveInProgress}>
                  Run
                </Button>
              </>
            ) : null}
          </PipelineStudioLayout.HeaderRight>
        </PipelineStudioLayout.Header>

        <PipelineStudioLayout.Split>
          <PipelineStudioLayout.SplitMain>
            <PipelineStudioView />
          </PipelineStudioLayout.SplitMain>

          <PipelineStudioLayout.SplitPanel open={panelOpen}>
            <UnifiedPipelineStudioPanel setPanelOpen={onPanelOpenChange} problems={errors.problems} />
          </PipelineStudioLayout.SplitPanel>
        </PipelineStudioLayout.Split>

        <UnifiedPipelineStudioFooter
          problemsCount={errors.problemsCount}
          togglePane={() => {
            onPanelOpenChange?.(!panelOpen)
          }}
          lastCommitInfo={lastCommitInfo}
        />
      </PipelineStudioLayout.Root>

      <UnifiedPipelineStepDrawer />
      <UnifiedPipelineStageConfigDrawer />
      <UnifiedPipelinePipelineConfigDrawer />
    </YamlEditorContextProvider>
  )
}
