import { NodeContent } from '@harnessio/pipeline-graph'

import { ContentNodeType } from './components/graph-implementation/types/content-node-type'
import PipelineStudioInternal from './components/pipeline-studio-internal'

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

  getNodesDefinition() {
    return Array.from(this.entityBank.values())
  }
}

export interface YamlRevision {
  yaml: string
  revision?: number
}

export interface PipelineStudioProps {
  view: 'yaml' | 'graph'
  contentNodeFactory: ContentNodeFactory
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
}

const PipelineStudio = (props: PipelineStudioProps): JSX.Element => {
  return <PipelineStudioInternal {...props} />
}

export { PipelineStudio }
