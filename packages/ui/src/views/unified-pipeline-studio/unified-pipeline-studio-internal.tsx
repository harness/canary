import { YamlEditorContextProvider } from '@harnessio/yaml-editor'

import { UnifiedPipelineRightDrawer } from './components/unified-pipeline-right-drawer'
import { UnifiedPipelineStudioFooter } from './components/unified-pipeline-studio-footer'
import PipelineStudioView from './components/unified-pipeline-studio-internal'
import PipelineStudioLayout from './components/unified-pipeline-studio-layout'
import { UnifiedPipelineStudioPanel } from './components/unified-pipeline-studio-panel'
import { VisualYamlToggle } from './components/visual-yaml-toggle'
import { useUnifiedPipelineStudioContext } from './context/unified-pipeline-studio-context'

export const PipelineStudioInternal = (): JSX.Element => {
  const { view, setView, errors, onPanelOpenChange, panelOpen } = useUnifiedPipelineStudioContext()

  return (
    <YamlEditorContextProvider>
      <PipelineStudioLayout.Root>
        <PipelineStudioLayout.Header>
          <VisualYamlToggle view={view} setView={setView} isYamlValid={errors.isYamlValid} />
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
        />
      </PipelineStudioLayout.Root>

      <UnifiedPipelineRightDrawer />
    </YamlEditorContextProvider>
  )
}
