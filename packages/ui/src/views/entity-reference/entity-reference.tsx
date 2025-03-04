import React, { useCallback, useMemo, useState } from 'react'

import { Icon } from '@/components'
import { cn } from '@utils/cn'

// Define the entity types
export type EntityType = 'file' | 'folder'

// Base entity interface
export interface BaseEntity {
  id: string
  name: string
  type: EntityType
  path?: string
}

// File entity
export interface FileEntity extends BaseEntity {
  type: 'file'
  extension?: string
  size?: number
}

// Folder entity
export interface FolderEntity extends BaseEntity {
  type: 'folder'
  children?: Entity[]
}

// Union type for all entity types
export type Entity = FileEntity | FolderEntity

// Props for the EntityReference component
export interface EntityReferenceProps {
  entities: Entity[]
  selectedEntityId?: string
  onSelectEntity?: (entity: Entity) => void
  className?: string
}

// Main EntityReference component
export const EntityReference: React.FC<EntityReferenceProps> = ({
  entities,
  selectedEntityId,
  onSelectEntity,
  className
}) => {
  // State for tracking expanded folders
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  // Process entities with expansion state
  const processedEntities = useMemo(() => {
    const processEntities = (entities: Entity[]): Entity[] => {
      return entities.map(entity => entity)
    }

    return processEntities(entities)
  }, [entities])

  // Handle toggling folder expansion
  const handleToggleExpand = useCallback((folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }, [])

  // Handle entity selection
  const handleSelectEntity = useCallback(
    (entity: Entity) => {
      onSelectEntity?.(entity)
    },
    [onSelectEntity]
  )

  // Recursive function to render the entity tree
  const renderEntity = (entity: Entity, level: number = 0) => {
    const isSelected = entity.id === selectedEntityId
    const isFolder = entity.type === 'folder'
    const isExpanded = isFolder && expandedFolders[entity.id]

    // Get icon based on entity type
    const getIcon = () => {
      if (isFolder) {
        return 'folder'
      }
      
      // For files, just use the generic file icon
      return 'file'
    }

    return (
      <React.Fragment key={entity.id}>
        <div
          className={cn(
            'flex items-center py-1 px-2 rounded cursor-pointer hover:bg-background-3 transition-colors',
            isSelected && 'bg-background-4'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleSelectEntity(entity)}
        >
          {isFolder && (
            <div
              className="flex items-center mr-1 cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                handleToggleExpand(entity.id)
              }}
            >
              <Icon
                name={isExpanded ? 'chevron-down' : 'chevron-right'}
                className="text-foreground-5"
                size={12}
              />
            </div>
          )}

          <Icon name={getIcon()} className="mr-2 text-foreground-5" size={16} />
          <span className="truncate">{entity.name}</span>

          {isFolder && entity.children && (
            <span className="ml-2 text-xs text-foreground-4">({entity.children.length || 0})</span>
          )}

          {entity.type === 'file' && entity.size !== undefined && (
            <span className="ml-auto text-xs text-foreground-4">
              {((entity.size || 0) / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        {/* Render children if this is an expanded folder */}
        {isFolder && isExpanded && entity.children && (
          <div>{entity.children.map(child => renderEntity(child, level + 1))}</div>
        )}
      </React.Fragment>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex-1 overflow-auto">
        {processedEntities.length > 0 ? (
          <div>{processedEntities.map(entity => renderEntity(entity))}</div>
        ) : (
          <div className="flex items-center justify-center h-full text-foreground-4">No entities available</div>
        )}
      </div>
    </div>
  )
}

export default EntityReference
