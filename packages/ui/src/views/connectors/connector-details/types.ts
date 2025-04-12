import { TranslationStore } from '@/views'
import { LogoNameMap } from '@components/logo'
import { ExecutionState } from '@views/repo/pull-request'

import { InputFactory } from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorConfigType, onSubmitConnectorProps } from '../types'

export interface EntityRef {
  scope: string
  identifier: string
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string | null
  parentUniqueId: string
  metadata: Record<string, any>
  repoIdentifier: string | null
  branch: string | null
  isDefault: boolean
  default: boolean
  fullyQualifiedScopeIdentifier: string
}

export interface ReferredEntity {
  type: string
  entityRef: EntityRef
  name: string
  scope?: string
  identifier?: string
  entityGitMetadata: Record<string, any> | null
}

export interface EntityDetail {
  type: string
  identifier: string
  referenceType: string
}

export interface ConnectorReferenceItem {
  accountIdentifier: string
  referredEntity: ReferredEntity
  referredByEntity: ReferredEntity
  detail: EntityDetail | null
  createdAt: number
}

export interface ConnectorReferenceList {
  content: ConnectorReferenceItem[]
}

export interface ConnectorReferenceListProps {
  entities: ConnectorReferenceList
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  toEntity: (entity: string) => void
  toScope: (scope: string) => void
}

export interface ConnectorDetailsReferenceListProps {}

export interface ConnectorDetailsItem {
  identifier: string
  type: ConnectorConfigType
  name?: string
  description?: string
  status?: ExecutionState
  lastModifiedAt?: number
  lastTestedAt?: number
  spec: {
    url?: string
  }
  gitDetails?: {
    repoIdentifier?: string
    branch?: string
    objectId?: string
  }
  createdAt: number
  lastConnectedAt: number
}

export interface ConnectorDetailsPageProps {
  connectorDetails: ConnectorDetailsItem
  onTest: (connectorId: string) => void
  onDelete: (connectorId: string) => void
  useTranslationStore: () => TranslationStore
  onSave: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  inputComponentFactory: InputFactory
  apiError?: string
  isConnectorReferencesLoading: boolean
  setIsConnectorRefSearchQuery: (query?: string) => void
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  entities: ConnectorReferenceList
  toEntity: (entity: string) => void
  toScope: (scope: string) => void
  searchQuery: string
  apiConnectorRefError?: string
}

export interface ConnectorDetailsReferencePageProps {
  searchQuery: string
  setSearchQuery: (query?: string) => void
  apiConnectorRefError?: string
  useTranslationStore: () => TranslationStore
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  isLoading: boolean
  entities: ConnectorReferenceList
  toEntity: (entity: string) => void
  toScope: (scope: string) => void
}

export interface ConnectorDetailsHeaderProps {
  connectorDetails: ConnectorDetailsItem
  onTest: (connectorId: string) => void
  onDelete: (connectorId: string) => void
  useTranslationStore: () => TranslationStore
}

export enum ConnectorDetailsTabsKeys {
  CONFIGURATION = 'Configuration',
  REFERENCES = 'References',
  ACTIVITY = 'ActivityHistory'
}

export interface ConnectorDetailsConfigurationProps {
  connectorDetails: ConnectorDetailsItem
  useTranslationStore: () => TranslationStore
  onSave: (values: onSubmitConnectorProps) => void
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  inputComponentFactory: InputFactory
  apiError?: string
}
