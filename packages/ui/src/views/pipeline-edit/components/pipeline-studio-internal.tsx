import { ContentNodeFactory, YamlRevision } from '../pipeline-studio'
import { PipelineStudioGraphView } from './pipeline-studio-graph-view'
import { PipelineStudioYamlView } from './pipeline-studio-yaml-view'

export interface PipelineStudioInternalProps {
  view: 'yaml' | 'graph'
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
}

export default function PipelineStudioInternal(props: PipelineStudioInternalProps) {
  const { view, yamlRevision, onYamlRevisionChange, contentNodeFactory } = props

  return view === 'graph' ? (
    <PipelineStudioGraphView
      contentNodeFactory={contentNodeFactory}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
    />
  ) : (
    <PipelineStudioYamlView yamlRevision={yamlRevision} onYamlRevisionChange={onYamlRevisionChange} />
  )
}
