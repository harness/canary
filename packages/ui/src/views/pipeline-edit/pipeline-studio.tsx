import { PipelineStudioGraphViewProps } from '@views/pipeline-edit/components/pipeline-studio-graph-view'

import { NodeContent } from '@harnessio/pipeline-graph'

import { ContentNodeType } from './components/graph-implementation/types/content-node-type'
import PipelineStudioInternal, { PipelineStudioInternalProps } from './components/pipeline-studio-internal'

export class ContentNodeFactory {
  private entityBank: Map<ContentNodeType, any>

  constructor() {
    this.entityBank = new Map()
  }

  registerEntity(entityType: ContentNodeType, definition: NodeContent) {
    this.entityBank.set(entityType, definition)
  }

  getEntityDefinition(entityType: ContentNodeType) {
    return this.entityBank.get(entityType)
  }

  getNodesDefinition(): NodeContent[] {
    return Array.from(this.entityBank.values())
  }
}

export interface YamlRevision {
  yaml: string
  revision?: number
}

export interface PipelineStudioProps
  extends Pick<PipelineStudioGraphViewProps, 'serialContainerConfig' | 'parallelContainerConfig'> {
  view: 'yaml' | 'graph'
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  yamlEditorConfig?: PipelineStudioInternalProps['yamlEditorConfig']
  onErrorChange?: PipelineStudioInternalProps['onErrorChange']
  getStepIcon?: PipelineStudioInternalProps['getStepIcon']
  animateYamlOnUpdate?: boolean
  onYamlAnimateEnd?: () => void
}

const PipelineStudio = (props: PipelineStudioProps): JSX.Element => {
  return <PipelineStudioInternal {...props} />
}

export { PipelineStudio }
