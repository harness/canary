import { TranslationStore } from '@/views'
import { LogoNameMap } from '@components/logo'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorConfigType } from '../types'

export interface ConnectorDetailsItem {
  identifier: string
  type?: ConnectorConfigType
  name?: string
  description?: string
  status?: ExecutionState
  lastModifiedAt?: number
  lastTestedAt?: number
  spec?: {
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
  useTranslationStore: () => TranslationStore
  onTest: () => void
}

export interface ConnectorDetailsHeaderProps {
  connectorDetails: ConnectorDetailsItem
  onTest: () => void
  useTranslationStore: () => TranslationStore
}
