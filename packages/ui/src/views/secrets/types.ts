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
  type: 'SecretFile' | 'SecretText' | 'SSHKey' | 'WinRmCredentials'
  name: string
  identifier: string
  orgIdentifier?: string
  projectIdentifier?: string
  tags?: {
    [key: string]: string
  }
  description?: string
  spec: {
    errorMessageForInvalidYaml?: string
  }
}

export interface SecretItem extends BaseEntityProps {
  secret: SecretData
  createdAt?: number
  updatedAt?: number
  draft?: boolean
}

export const secretsFilterTypes = {
  all: 'Show all secrets',
  SecretText: 'Text',
  SecretFile: 'Encrypted file'
}
