import { YamlEditorContextProvider } from '@harnessio/yaml-editor'

import { ContentNodeFactory, YamlRevision } from '../pipeline-studio'
import { PipelineStudioGraphView } from './pipeline-studio-graph-view'
import { PipelineStudioYamlView, PipelineStudioYamlViewProps } from './pipeline-studio-yaml-view'

export interface PipelineStudioInternalProps {
  view: 'yaml' | 'graph'
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  yamlEditorConfig?: PipelineStudioYamlViewProps['yamlEditorConfig']
  onErrorChange?: PipelineStudioYamlViewProps['onErrorChange']
}

export default function PipelineStudioInternal(props: PipelineStudioInternalProps) {
  const { view, yamlRevision, onYamlRevisionChange, contentNodeFactory, yamlEditorConfig, onErrorChange } = props

  return view === 'graph' ? (
    <PipelineStudioGraphView
      contentNodeFactory={contentNodeFactory}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
    />
  ) : (
    <YamlEditorContextProvider>
      <PipelineStudioYamlView
        yamlRevision={yamlRevision}
        onYamlRevisionChange={onYamlRevisionChange}
        yamlEditorConfig={yamlEditorConfig}
        onErrorChange={onErrorChange}
      />
    </YamlEditorContextProvider>
  )
}
