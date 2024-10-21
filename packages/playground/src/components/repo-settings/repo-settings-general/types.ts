export interface RepoBranch {
  name?: string
  sha?: string
}

export interface RepoData {
  name: string
  description: string
  defaultBranch: string
  isPublic: boolean
  branches: RepoBranch[]
}

export enum AccessLevel {
  PRIVATE = '2',
  PUBLIC = '1'
}
export interface RepoUpdateData {
  name: string
  description: string
  branch: string
  access: AccessLevel
}
export interface SecretsScanning {}
