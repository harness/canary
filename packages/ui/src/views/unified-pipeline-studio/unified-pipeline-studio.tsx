import { TranslationStore } from '..'
import { UnifiedPipelineStudioNodeContextProvider } from './components/graph-implementation/context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from './components/graph-implementation/types/common-node-data-type'
import { YamlEntityType } from './components/graph-implementation/types/yaml-entity-type'
import { PipelineStudioNodeContextMenu } from './components/unified-pipeline-studio-node-context-menu'
import { YamlErrorDataType } from './components/unified-pipeline-studio-yaml-view'
import { VisualYamlValue } from './components/visual-yaml-toggle'
import { UnifiedPipelineStudioProvider } from './context/unified-pipeline-studio-context'
import { YamlRevision } from './types/common-types'
import { PipelineStudioInternal } from './unified-pipeline-studio-internal'

export interface IUnifiedPipelineStudioStore {
  /** yaml state */
  yamlRevision: YamlRevision
  /** yaml change callback */
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  /** NOTE: selected node path may change on node deletion to keep same node selected */
  selectedPath?: string
  onSelectedPathChange: (path: string) => void
  /** yaml errors */
  errors: YamlErrorDataType
  onErrorsChange?: (errors: YamlErrorDataType) => void
  /** problems and other tabs open state */
  panelOpen: boolean
  onPanelOpenChange?: (open: boolean) => void
}

export interface UnifiedPipelineStudioProps {
  useUnifiedPipelineStudioStore: () => IUnifiedPipelineStudioStore
  useTranslationStore: () => TranslationStore
  initialView?: VisualYamlValue
}

export const UnifiedPipelineStudio = (props: UnifiedPipelineStudioProps): JSX.Element => {
  const { useUnifiedPipelineStudioStore, initialView = 'visual', useTranslationStore } = props
  const {
    yamlRevision,
    onYamlRevisionChange,
    onSelectedPathChange,
    selectedPath,
    errors,
    onErrorsChange,
    panelOpen,
    onPanelOpenChange
  } = useUnifiedPipelineStudioStore()

  const onSelectIntention = (nodeData: CommonNodeDataType) => {
    onSelectedPathChange(nodeData.yamlPath)
  }

  const onEditIntention = (_nodeData: CommonNodeDataType) => {
    // throw new Error('Function not implemented.')
  }

  const onRevealInYaml = (_path: string | undefined) => {
    // throw new Error('Function not implemented.')
  }

  const onAddIntention = (
    _nodeData: CommonNodeDataType,
    _position: 'after' | 'before' | 'in',
    _yamlEntityTypeToAdd?: YamlEntityType | undefined
  ) => {
    // throw new Error('Function not implemented.')
  }

  const onDeleteIntention = (_nodeData: CommonNodeDataType) => {
    // throw new Error('Function not implemented.')
  }

  return (
    <UnifiedPipelineStudioProvider
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
      onSelectedPathChange={onSelectedPathChange}
      selectedPath={selectedPath}
      errors={errors}
      onErrorsChange={onErrorsChange}
      panelOpen={panelOpen}
      onPanelOpenChange={onPanelOpenChange}
      useTranslationStore={useTranslationStore}
      initialView={initialView}
    >
      <UnifiedPipelineStudioNodeContextProvider
        selectedPath={selectedPath}
        onAddIntention={onAddIntention}
        onDeleteIntention={onDeleteIntention}
        onEditIntention={onEditIntention}
        onRevealInYaml={onRevealInYaml}
        onSelectIntention={onSelectIntention}
      >
        <PipelineStudioInternal />
        <PipelineStudioNodeContextMenu />
      </UnifiedPipelineStudioNodeContextProvider>
    </UnifiedPipelineStudioProvider>
  )
}
