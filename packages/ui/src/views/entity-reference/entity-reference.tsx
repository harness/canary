import React, { useCallback, useState } from 'react'

import { Button, Icon } from '@/components'
import { cn } from '@utils/cn'

// Base properties that all entities must have
export interface BaseEntityProps {
  id: string
  name: string
}

// Define the scope types
export type ScopeType = 'account' | 'organization' | 'project'

// Props for rendering a single entity item
export interface EntityRendererProps<T extends BaseEntityProps> {
  entity: T
  isSelected: boolean
  isExpanded?: boolean
  onSelect: (entity: T) => void
  onToggleExpand?: (entityId: string) => void
}

// Props for the EntityReference component
export interface EntityReferenceProps<T extends BaseEntityProps> {
  // Data
  entities: T[]
  selectedEntityId?: string

  // Callbacks
  onSelectEntity?: (entity: T) => void
  onScopeChange?: (scope: ScopeType) => void
  onCancel?: () => void

  // UI Configuration
  className?: string
  showFilter?: boolean
  activeScope?: ScopeType

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  renderScopeSelector?: (activeScope: ScopeType, onScopeChange: (scope: ScopeType) => void) => React.ReactNode

  // Entity structure helpers
  getEntityChildren?: (entity: T) => T[] | undefined
  isExpandable?: (entity: T) => boolean
  filterEntity?: (entity: T, filterText: string) => boolean
  getEntityIcon?: (entity: T, isExpanded?: boolean) => string
}

/**
 * A generic component for displaying and selecting entities with hierarchical structure
 */
export function EntityReference<T extends BaseEntityProps>({
  // Data
  entities,
  selectedEntityId,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel,

  // UI Configuration
  className,
  showFilter = true,
  activeScope = 'account',

  // Custom renderers
  renderEntity,
  renderScopeSelector,

  // Entity structure helpers
  getEntityChildren = () => undefined,
  isExpandable = () => false,
  filterEntity = (entity, filterText) => entity.name.toLowerCase().includes(filterText.toLowerCase()),
  getEntityIcon = () => 'file'
}: EntityReferenceProps<T>): JSX.Element {
  // State for tracking expanded entities and filter text
  const [expandedEntities, setExpandedEntities] = useState<Record<string, boolean>>({})
  const [filterText, setFilterText] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<T | undefined>(
    entities.find(entity => entity.id === selectedEntityId)
  )

  // Handle toggling entity expansion
  const handleToggleExpand = useCallback((entityId: string) => {
    setExpandedEntities(prev => ({
      ...prev,
      [entityId]: !prev[entityId]
    }))
  }, [])

  // Handle entity selection
  const handleSelectEntity = useCallback(
    (entity: T) => {
      setSelectedEntity(entity)
      onSelectEntity?.(entity)
    },
    [onSelectEntity]
  )

  // Handle scope change
  const handleScopeChange = useCallback(
    (scope: ScopeType) => {
      onScopeChange?.(scope)
    },
    [onScopeChange]
  )

  // Handle apply button click
  const handleApply = useCallback(() => {
    if (selectedEntity) {
      onSelectEntity?.(selectedEntity)
    }
  }, [selectedEntity, onSelectEntity])

  // Filter entities based on filter text
  const filteredEntities = entities.filter(entity => {
    if (!filterText) return true
    return filterEntity(entity, filterText)
  })

  // Default entity renderer
  const defaultEntityRenderer = ({
    entity,
    isSelected,
    isExpanded,
    onSelect,
    onToggleExpand
  }: EntityRendererProps<T>) => {
    const canExpand = isExpandable(entity)
    const iconName = getEntityIcon(entity, isExpanded)
    const children = getEntityChildren(entity)

    console.log('Rendering entity - but i should not be here', entity)

    return (
      <div
        className={cn(
          'flex items-center py-1 px-2 rounded cursor-pointer hover:bg-background-3 transition-colors',
          isSelected && 'bg-background-4'
        )}
        onClick={() => onSelect(entity)}
      >
        {canExpand && onToggleExpand && (
          <div
            className="flex items-center mr-1 cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              onToggleExpand(entity.id)
            }}
          >
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} className="text-foreground-5" size={12} />
          </div>
        )}

        <Icon name={iconName} className="mr-2 text-foreground-5" size={16} />
        <span className="truncate">{entity.name}</span>

        {canExpand && children && <span className="ml-2 text-xs text-foreground-4">({children.length || 0})</span>}

        {'type' in entity && entity.type === 'secret' && (
          <button
            className="ml-auto px-3 py-1 text-sm rounded bg-primary text-white hover:bg-primary-dark transition-colors"
            onClick={e => {
              e.stopPropagation()
              onSelect(entity)
            }}
          >
            Select
          </button>
        )}
      </div>
    )
  }

  // Default scope selector renderer
  const defaultScopeSelectorRenderer = (activeScope: ScopeType, onScopeChange: (scope: ScopeType) => void) => (
    <div className="flex mb-4">
      <div
        className={cn('flex items-center py-2 px-4 cursor-pointer', activeScope === 'account' && 'font-medium')}
        onClick={() => onScopeChange('account')}
      >
        <Icon name="account" className="mr-2" size={16} />
        <span>Account</span>
      </div>
      <div
        className={cn('flex items-center py-2 px-4 cursor-pointer', activeScope === 'organization' && 'font-medium')}
        onClick={() => onScopeChange('organization')}
      >
        <Icon name="folder" className="mr-2" size={16} />
        <span>Organization</span>
      </div>
    </div>
  )

  // Function to render the entity list
  const renderEntityList = () => {
    return filteredEntities.map(entity => {
      const isSelected = entity.id === selectedEntityId || entity === selectedEntity
      const isExpanded = expandedEntities[entity.id]
      const canExpand = isExpandable(entity)
      const children = getEntityChildren(entity)

      return (
        <React.Fragment key={entity.id}>
          {renderEntity
            ? renderEntity({
                entity,
                isSelected,
                isExpanded,
                onSelect: handleSelectEntity,
                onToggleExpand: canExpand ? handleToggleExpand : undefined
              })
            : defaultEntityRenderer({
                entity,
                isSelected,
                isExpanded,
                onSelect: handleSelectEntity,
                onToggleExpand: canExpand ? handleToggleExpand : undefined
              })}

          {canExpand && isExpanded && children && (
            <div className="ml-5">
              {children.map(child => {
                const childIsSelected = child.id === selectedEntityId || child === selectedEntity
                const childIsExpanded = expandedEntities[child.id]
                const childCanExpand = isExpandable(child)

                return (
                  <React.Fragment key={child.id}>
                    {renderEntity
                      ? renderEntity({
                          entity: child,
                          isSelected: childIsSelected,
                          isExpanded: childIsExpanded,
                          onSelect: handleSelectEntity,
                          onToggleExpand: childCanExpand ? handleToggleExpand : undefined
                        })
                      : defaultEntityRenderer({
                          entity: child,
                          isSelected: childIsSelected,
                          isExpanded: childIsExpanded,
                          onSelect: handleSelectEntity,
                          onToggleExpand: childCanExpand ? handleToggleExpand : undefined
                        })}
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Scope selector */}
      {onScopeChange &&
        (renderScopeSelector
          ? renderScopeSelector(activeScope, handleScopeChange)
          : defaultScopeSelectorRenderer(activeScope, handleScopeChange))}

      {/* Filter input */}
      {showFilter && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by name..."
            className="w-full px-3 py-2 text-sm border rounded border-borders-2 bg-background-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
      )}

      {/* Entity list */}
      <div className="flex-1 overflow-auto border rounded border-borders-2 p-2">
        {filteredEntities.length > 0 ? (
          <div>{renderEntityList()}</div>
        ) : (
          <div className="flex items-center justify-center h-full text-foreground-4">
            {filterText ? 'No matching items found' : 'No items available'}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(onSelectEntity || onCancel) && (
        <div className="flex mt-4 space-x-2">
          {onSelectEntity && (
            <Button variant={'default'} onClick={handleApply} disabled={!selectedEntity}>
              Apply
            </Button>
          )}
          {onCancel && (
            <Button variant={'secondary'} onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default EntityReference
