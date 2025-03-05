import React from 'react'

import { Button, ButtonGroup, Icon, Spacer, StackedList } from '@/components'
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
    const { entity } = props

    return (
      <StackedList.Item
        onClick={() => onSelectEntity(entity)}
        className={selectedEntity?.id === entity.id ? 'bg-background-4' : ''}
        thumbnail={<Icon name="secrets" size={16} className="text-foreground-5" />}
        actions={
          <Button
            variant="default"
            size="sm"
            onClick={e => {
              e.stopPropagation()
              onSelectEntity(entity)
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
    const { scope } = props

    // Icon based on scope
    const getIcon = () => {
      if (scope === 'account') return 'account'
      if (scope === 'organization') return 'folder'
      return 'folder'
    }

    return (
      <StackedList.Item
        onClick={() => onScopeChange(scope)}
        className={scope === activeScope ? 'bg-background-4 font-medium' : ''}
        thumbnail={<Icon name={getIcon()} size={16} className="text-foreground-5" />}
      >
        <StackedList.Field title={<span className="capitalize">{scope}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <div>
      <span className="font-medium">Select an existing Secret:</span>
      <Spacer size={4} />
      <EntityReference<SecretItem, SecretScope>
        entities={getEntitiesByScope()}
        selectedEntity={selectedEntity}
        // onSelectEntity={onSelectEntity}
        // onScopeChange={onScopeChange}
        activeScope={activeScope}
        scopes={availableScopes}
        renderEntity={renderEntity}
        renderScopeSelector={renderScopeSelector}
        onCancel={onCancel}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-background-2 p-4 shadow-md">
        <ButtonGroup className="flex flex-row justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
