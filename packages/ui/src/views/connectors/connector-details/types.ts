import { TranslationStore } from '@/views'
import { LogoNameMap } from '@components/logo'
import { ExecutionState } from '@views/repo/pull-request'

import { InputFactory } from '@harnessio/forms'

import { AnyConnectorDefinition, ConnectorConfigType, onSubmitConnectorProps } from '../types'

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
  icon: keyof typeof LogoNameMap
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
}
