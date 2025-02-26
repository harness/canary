import { NodeContent } from '@harnessio/pipeline-graph'

import { ContentNodeType } from '../types/content-node-type'

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
