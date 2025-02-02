import { ContainerNode } from '@harnessio/pipeline-graph'

import { PipelineStudioNodeContextProvider } from './components/graph-implementation/context/PipelineStudioNodeContext'
import { EndContentNode } from './components/graph-implementation/nodes/end-content-node'
import { ParallelStageGroupContentNode } from './components/graph-implementation/nodes/parallel-stage-group-content-node'
import { ParallelStepGroupContentNode } from './components/graph-implementation/nodes/parallel-step-group-content-node'
import { SerialStageGroupContentNode } from './components/graph-implementation/nodes/serial-stage-group-content-node'
import { SerialStepGroupContentNode } from './components/graph-implementation/nodes/serial-step-group-content-node'
import { StageContentNode } from './components/graph-implementation/nodes/stage-content-node'
import { StartContentNode } from './components/graph-implementation/nodes/start-content-node'
import { StepContentNode } from './components/graph-implementation/nodes/step-content-node'
import { CommonNodeDataType } from './components/graph-implementation/types/common-node-data-type'
import { ContentNodeType } from './components/graph-implementation/types/content-node-type'
import { YamlEntityType } from './components/graph-implementation/types/yaml-entity-type'
import { PipelineStudioNodeContextMenu } from './components/pipeline-studio-node-context-menu'
import { ErrorDataType } from './components/pipeline-studio-yaml-view'
import { ContentNodeFactory, PipelineStudio, PipelineStudioProps, YamlRevision } from './pipeline-studio'

export interface PipelineEditProps {
  /** pipeline view */
  view: 'yaml' | 'graph'
  /** yaml state */
  yamlRevision: YamlRevision
  /** yaml change callback */
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  /** selected path */
  selectedPath?: string
  onSelectIntention: (nodeData: CommonNodeDataType) => undefined
  onAddIntention: (
    nodeData: CommonNodeDataType,
    position: 'after' | 'before' | 'in',
    yamlEntityTypeToAdd?: YamlEntityType
  ) => void
  onEditIntention: (nodeData: CommonNodeDataType) => undefined
  onDeleteIntention: (nodeData: CommonNodeDataType) => undefined
  onRevealInYaml: (_path: string | undefined) => undefined
  yamlEditorConfig?: PipelineStudioProps['yamlEditorConfig']
  onErrorChange?: (data: ErrorDataType) => void
  getStepIcon?: PipelineStudioProps['getStepIcon']
}

export const PipelineEdit = (props: PipelineEditProps): JSX.Element => {
  const {
    view,
    yamlRevision,
    onYamlRevisionChange,
    onAddIntention,
    onDeleteIntention,
    onEditIntention,
    onSelectIntention,
    onRevealInYaml,
    yamlEditorConfig,
    selectedPath,
    onErrorChange,
    getStepIcon
  } = props

  const contentNodeFactory = new ContentNodeFactory()

  contentNodeFactory.registerEntity(ContentNodeType.Start, {
    type: ContentNodeType.Start,
    component: StartContentNode,
    containerType: ContainerNode.leaf
  })

  contentNodeFactory.registerEntity(ContentNodeType.End, {
    type: ContentNodeType.End,
    component: EndContentNode,
    containerType: ContainerNode.leaf
  })

  // ---

  contentNodeFactory.registerEntity(ContentNodeType.Step, {
    type: ContentNodeType.Step,
    component: StepContentNode,
    containerType: ContainerNode.leaf
  })

  contentNodeFactory.registerEntity(ContentNodeType.ParallelStepGroup, {
    type: ContentNodeType.ParallelStepGroup,
    component: ParallelStepGroupContentNode,
    containerType: ContainerNode.parallel
  })

  contentNodeFactory.registerEntity(ContentNodeType.SerialStepGroup, {
    type: ContentNodeType.SerialStepGroup,
    component: SerialStepGroupContentNode,
    containerType: ContainerNode.serial
  })

  // ---

  contentNodeFactory.registerEntity(ContentNodeType.Stage, {
    type: ContentNodeType.Stage,
    component: StageContentNode,
    containerType: ContainerNode.serial
  })

  contentNodeFactory.registerEntity(ContentNodeType.ParallelStageGroup, {
    type: ContentNodeType.ParallelStageGroup,
    component: ParallelStageGroupContentNode,
    containerType: ContainerNode.parallel
  })

  contentNodeFactory.registerEntity(ContentNodeType.SerialStageGroup, {
    type: ContentNodeType.SerialStageGroup,
    component: SerialStageGroupContentNode,
    containerType: ContainerNode.serial
  })

  return (
    <PipelineStudioNodeContextProvider
      selectedPath={selectedPath}
      onAddIntention={onAddIntention}
      onDeleteIntention={onDeleteIntention}
      onEditIntention={onEditIntention}
      onRevealInYaml={onRevealInYaml}
      onSelectIntention={onSelectIntention}
    >
      <PipelineStudio
        contentNodeFactory={contentNodeFactory}
        view={view}
        yamlRevision={yamlRevision}
        onYamlRevisionChange={onYamlRevisionChange}
        yamlEditorConfig={yamlEditorConfig}
        onErrorChange={onErrorChange}
        getStepIcon={getStepIcon}
      />
      <PipelineStudioNodeContextMenu />
    </PipelineStudioNodeContextProvider>
  )
}
