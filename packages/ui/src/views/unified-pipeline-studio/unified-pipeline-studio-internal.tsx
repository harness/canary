import { Button, FileToolbarActions } from '@components/index'
import { noop } from 'lodash-es'

import { YamlEditorContextProvider } from '@harnessio/yaml-editor'

import { UnifiedPipelineRightDrawer } from './components/unified-pipeline-right-drawer'
import { UnifiedPipelineStudioFooter } from './components/unified-pipeline-studio-footer'
import PipelineStudioView from './components/unified-pipeline-studio-internal'
import PipelineStudioLayout from './components/unified-pipeline-studio-layout'
import { UnifiedPipelineStudioPanel } from './components/unified-pipeline-studio-panel'
import { VisualYamlToggle } from './components/visual-yaml-toggle'
import { useUnifiedPipelineStudioContext } from './context/unified-pipeline-studio-context'

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
    saveInProgress,
    isYamlDirty,
    hideSaveBtn,
    lastCommitInfo
  } = useUnifiedPipelineStudioContext()

  const isFloatingHeader = view === 'visual'

  return (
    <YamlEditorContextProvider>
      <PipelineStudioLayout.Root>
        <PipelineStudioLayout.Header floating={isFloatingHeader}>
          <VisualYamlToggle view={view} setView={setView} isYamlValid={errors.isYamlValid} />
          <PipelineStudioLayout.HeaderLeft>
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
              <Button
                loading={saveInProgress}
                size="sm"
                onClick={() => onSave(yamlRevision.yaml)}
                disabled={!isYamlDirty}
              >
                Save
              </Button>
            ) : null}
          </PipelineStudioLayout.HeaderLeft>
        </PipelineStudioLayout.Header>

        <PipelineStudioLayout.Split>
          <PipelineStudioLayout.SplitMain floating={isFloatingHeader}>
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

      <UnifiedPipelineRightDrawer />
    </YamlEditorContextProvider>
  )
}
