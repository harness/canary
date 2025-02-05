import { YamlEditorContextProvider } from '@harnessio/yaml-editor'

import { ContentNodeFactory, YamlRevision } from '../pipeline-studio'
import { PipelineStudioGraphView, PipelineStudioGraphViewProps } from './pipeline-studio-graph-view'
import { PipelineStudioYamlView, PipelineStudioYamlViewProps } from './pipeline-studio-yaml-view'

export interface PipelineStudioInternalProps
  extends Pick<PipelineStudioGraphViewProps, 'serialContainerConfig' | 'parallelContainerConfig'> {
  view: 'yaml' | 'graph'
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  yamlEditorConfig?: PipelineStudioYamlViewProps['yamlEditorConfig']
  onErrorChange?: PipelineStudioYamlViewProps['onErrorChange']
  getStepIcon?: PipelineStudioGraphViewProps['getStepIcon']
  animateYamlOnUpdate?: boolean
  onYamlAnimateEnd?: () => void
}

export default function PipelineStudioInternal(props: PipelineStudioInternalProps) {
  const {
    view,
    yamlRevision,
    onYamlRevisionChange,
    contentNodeFactory,
    yamlEditorConfig,
    onErrorChange,
    getStepIcon,
    animateYamlOnUpdate: animateOnUpdate,
    onYamlAnimateEnd: onAnimateEnd,
    serialContainerConfig,
    parallelContainerConfig
  } = props

  return view === 'graph' ? (
    <PipelineStudioGraphView
      contentNodeFactory={contentNodeFactory}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
      getStepIcon={getStepIcon}
      serialContainerConfig={serialContainerConfig}
      parallelContainerConfig={parallelContainerConfig}
    />
  ) : (
    <YamlEditorContextProvider>
      <PipelineStudioYamlView
        yamlRevision={yamlRevision}
        onYamlRevisionChange={onYamlRevisionChange}
        yamlEditorConfig={yamlEditorConfig}
        onErrorChange={onErrorChange}
        animateOnUpdate={animateOnUpdate}
        onAnimateEnd={onAnimateEnd}
      />
    </YamlEditorContextProvider>
  )
}
