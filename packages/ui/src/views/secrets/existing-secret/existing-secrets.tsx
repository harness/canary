import React from 'react'

import { Button, ButtonGroup, Icon, Spacer, StackedList } from '@/components'
import { BaseEntityProps, EntityReference, EntityRendererProps, ScopeSelectorProps } from '@/views/entity-reference'

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

export interface ExistingSecretsProps {
  // Data
  secretsData: SecretItem[]
  folders: string[]

  // State
  selectedEntity: SecretItem | null
  activeScope: SecretScope | null

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (scope: SecretScope) => void
  onFolderChange: (folder: string, scope: SecretScope) => void
  onCancel?: () => void
}

// Component for selecting existing secrets
export const ExistingSecrets: React.FC<ExistingSecretsProps> = ({
  // Data
  secretsData,
  folders,

  // State
  selectedEntity,
  activeScope,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onFolderChange,
  onCancel
}) => {
  // Define available scopes
  const availableScopes: SecretScope[] = ['account', 'organization', 'project']

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

    return (
      <StackedList.Item
        onClick={() => onSelect(scope)}
        className={isActive ? 'bg-background-4 font-medium' : ''}
        thumbnail={<Icon name="circle-arrow-top" size={16} className="text-foreground-5" />}
      >
        <StackedList.Field title={<span className="capitalize">{scope}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <span className="font-medium mb-4">Select an existing Secret:</span>
      <div className="flex-1">
        <EntityReference<SecretItem, SecretScope>
          entities={secretsData}
          selectedEntity={selectedEntity}
          onSelectEntity={onSelectEntity}
          onScopeChange={onScopeChange}
          onFolderChange={onFolderChange}
          activeScope={activeScope}
          scopes={availableScopes}
          renderEntity={renderEntity}
          renderScopeSelector={renderScopeSelector}
          folders={folders}
        />
      </div>
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
