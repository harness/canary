import { ExecutionStatusType } from '@components/pipeline-nodes/types/types'

import { YamlEntityType } from './yaml-entity-type'

export interface CommonNodeDataType {
  yamlPath: string
  yamlChildrenPath?: string
  name: string
  yamlEntityType: YamlEntityType
  executionStatus?: ExecutionStatusType
}
