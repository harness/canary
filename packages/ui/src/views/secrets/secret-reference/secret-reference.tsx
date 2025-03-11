import React from 'react'

import { Button, ButtonGroup, Icon, StackedList } from '@/components'
import { EntityReference, EntityRendererProps, ScopeSelectorProps } from '@/views/entity-reference'

import { DirectoryType, SecretItem } from '../types'

export interface SecretReferenceProps {
  // Data
  secretsData: SecretItem[]
  childFolder: string | null
  parentFolder: string | null

  // State
  selectedEntity: SecretItem | null

  // Callbacks
  onSelectEntity: (entity: SecretItem) => void
  onScopeChange: (direction: DirectoryType) => void
  onCancel?: () => void
}

// Component for selecting existing secrets
export const SecretReference: React.FC<SecretReferenceProps> = ({
  // Data
  secretsData,
  childFolder,
  parentFolder,

  // State
  selectedEntity,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel
}) => {
  // Define available scopes

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
  const renderScopeSelector = (props: ScopeSelectorProps<string>) => {
    const { parentFolder, onSelect } = props

    return (
      <StackedList.Item
        onClick={() => onSelect(parentFolder)}
        thumbnail={<Icon name="circle-arrow-top" size={16} className="text-foreground-5" />}
      >
        <StackedList.Field title={<span className="capitalize">{parentFolder}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <span className="font-medium mb-4">Select an existing Secret:</span>
      <div className="flex-1">
        <EntityReference<SecretItem, string, string>
          entities={secretsData}
          selectedEntity={selectedEntity}
          onSelectEntity={onSelectEntity}
          onScopeChange={onScopeChange}
          renderEntity={renderEntity}
          renderScopeSelector={renderScopeSelector}
          parentFolder={parentFolder}
          childFolder={childFolder}
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
