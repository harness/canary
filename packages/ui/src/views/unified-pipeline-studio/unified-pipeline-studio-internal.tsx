import { Button, FileToolbarActions, Icon } from '@components/index'
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
    setRightDrawer,
    setEditPipelineIntention
  } = useUnifiedPipelineStudioContext()

  return (
    <YamlEditorContextProvider>
      <PipelineStudioLayout.Root>
        <PipelineStudioLayout.Header isYamlView={view === 'yaml'}>
          <VisualYamlToggle view={view} setView={setView} isYamlValid={errors.isYamlValid} />
          <PipelineStudioLayout.HeaderLeft>
            <Button
              size="sm"
              variant="outline"
              iconOnly
              aria-label="Edit pipeline"
              onClick={() => {
                setEditPipelineIntention({ path: 'pipeline' })
                setRightDrawer(RightDrawer.PipelineConfig)
              }}
            >
              <Icon name="edit-pen" />
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
                  Save
                </Button>
                <Button loading={saveInProgress} size="sm" onClick={() => onRun()} disabled={isYamlDirty}>
                  Run
                </Button>
              </>
            ) : null}
          </PipelineStudioLayout.HeaderLeft>
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
