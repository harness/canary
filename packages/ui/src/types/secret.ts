import { BaseEntityProps } from './entity'

export enum SecretCreationType {
  SECRET_TEXT = 'SecretText',
  SECRET_FILE = 'SecretFile',
  SSH_KEY = 'SSHKey',
  WINRM_CREDENTIALS = 'WinRmCredentials'
}

export interface SecretDataType {
  type: SecretCreationType
  name: string
  identifier: string
  tags: string
  description: string
}

export enum SecretType {
  NEW = 'new',
  EXISTING = 'existing'
}

export interface SecretData {
  type: `${SecretCreationType}`
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

export interface SecretListItem {
  identifier: string
  name?: string
  spec?: {
    secretManagerIdentifier?: string
    valueType?: string
    value?: string
    additionalMetadata?: string
  }
  createdAt?: number
  updatedAt?: number
  description?: string
  type?: string
  tags?: {
    [key: string]: string
  }
}
