import { BaseEntityProps } from '@views/platform'

export interface SecretDataType {
  type: SecretCreationType
  name: string
  identifier: string
  tags: string
  description: string
}

export enum SecretCreationType {
  SECRET_TEXT = 'SecretText',
  SECRET_FILE = 'SecretFile'
}

export enum SecretType {
  NEW = 'new',
  EXISTING = 'existing'
}

export interface SecretData {
  type: string
  name: string
  identifier: string
  orgIdentifier?: string
  projectIdentifier?: string
  tags: Record<string, string | undefined>
  description?: string
}

// Define our custom scope type
export type SecretScope = 'account' | 'organization' | 'project'

export interface SecretItem extends BaseEntityProps {
  secret: SecretData
  createdAt: number
  updatedAt: number
  draft: boolean
}
