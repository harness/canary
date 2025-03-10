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
  New = 'new',
  Existing = 'existing'
}
