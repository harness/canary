import React from 'react'

import { Button, Icon, Spacer, StackedList } from '@/components'
import { BaseEntityProps, EntityReference, EntityRendererProps, ScopeSelectorProps } from '@/views'

export interface SecretSpec {
  secretManagerIdentifier: string
  valueType: string
  value: string | null
  additionalMetadata: any | null
}

export interface SecretData {
  type: string
  name: string
  identifier: string
  orgIdentifier: string
  projectIdentifier?: string
  tags: Record<string, string>
  description: string
  spec: SecretSpec
}

// Define our custom scope type
export type SecretScope = 'account' | 'organization' | string

export interface SecretItem extends BaseEntityProps {
  secret: SecretData
  createdAt: number
  updatedAt: number
  draft: boolean
  governanceMetadata: any | null
  scope?: SecretScope
}

export interface ExistingSecretsProps {
  // Data
  accountSecrets: SecretItem[]
  organizationSecrets: SecretItem[]

  // State
  selectedEntity: SecretItem | null
  activeScope: SecretScope

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (scope: SecretScope) => void
  onCancel?: () => void
}

// Component for selecting existing secrets
export const ExistingSecrets: React.FC<ExistingSecretsProps> = ({
  // Data
  accountSecrets,
  organizationSecrets,

  // State
  selectedEntity,
  activeScope,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel
}) => {
  // Define available scopes
  const availableScopes: SecretScope[] = ['account', 'organization']

  // Get entities based on active scope
  const getEntitiesByScope = () => {
    switch (activeScope) {
      case 'account':
        return accountSecrets
      case 'organization':
        return organizationSecrets
      default:
        return []
    }
  }

  // Custom entity renderer for secrets
  const renderEntity = (props: EntityRendererProps<SecretItem>) => {
    const { entity, isSelected, onSelect } = props

    return (
      <StackedList.Item
        onClick={() => onSelect(entity)}
        className={isSelected ? 'bg-background-4' : ''}
        thumbnail={<Icon name="secrets" size={16} className="text-foreground-5" />}
        actions={
          <Button
            variant="default"
            size="sm"
            onClick={e => {
              e.stopPropagation()
              onSelect(entity)
            }}
          >
            Select
          </Button>
        }
      >
        <StackedList.Field title={entity.secret.name} description={entity.secret.description || undefined} />
      </StackedList.Item>
    )
  }

  // Custom scope selector renderer
  const renderScopeSelector = (props: ScopeSelectorProps<SecretScope>) => {
    const { scope, isActive, onSelect } = props

    // Icon based on scope
    const getIcon = () => {
      if (scope === 'account') return 'account'
      if (scope === 'organization') return 'folder'
      return 'folder'
    }

    return (
      <StackedList.Item
        onClick={() => onSelect(scope)}
        className={isActive ? 'bg-background-4 font-medium' : ''}
        thumbnail={<Icon name={getIcon()} size={16} className="text-foreground-5" />}
      >
        <StackedList.Field title={<span className="capitalize">{scope}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <div>
      <span className="font-medium">Select an existing Secret:</span>
      <Spacer size={6} />

      <EntityReference<SecretItem, SecretScope>
        entities={getEntitiesByScope()}
        selectedEntityId={selectedEntity?.id}
        onSelectEntity={onSelectEntity}
        onScopeChange={onScopeChange}
        activeScope={activeScope}
        scopes={availableScopes}
        renderEntity={renderEntity}
        renderScopeSelector={renderScopeSelector}
        onCancel={onCancel}
      />
    </div>
  )
}
