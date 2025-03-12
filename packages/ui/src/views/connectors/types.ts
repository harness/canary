import { BaseEntityProps } from '@views/platform/types'

export interface ConnectorFields {
  name: string
  identifier: string
  description: string
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string
  tags: Record<string, string>
  type: string
}

export interface ConnectorItem extends BaseEntityProps {
  connector: ConnectorFields
  createdAt: number
  lastModifiedAt: number
}

export enum ConnectorType {
  NEW = 'new',
  EXISTING = 'existing'
}
