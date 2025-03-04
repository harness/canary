import React, { useCallback, useState } from 'react'

import { Button, Icon, IconProps } from '@/components'
import { Root as StackedList, Field as StackedListField, Item as StackedListItem } from '@/components/stacked-list'
import { cn } from '@utils/cn'

// Base properties that all entities must have
export interface BaseEntityProps {
  id: string
  name: string
}

// Props for rendering a single entity item
export interface EntityRendererProps<T extends BaseEntityProps> {
  entity: T
  isSelected: boolean
  onSelect: (entity: T) => void
}

// Props for the scope selector item
export interface ScopeSelectorProps<S = string> {
  scope: S
  isActive: boolean
  onSelect: (scope: S) => void
}

// Props for the EntityReference component
export interface EntityReferenceProps<T extends BaseEntityProps, S = string> {
  // Data
  entities: T[]
  selectedEntityId?: string

  // Callbacks
  onSelectEntity?: (entity: T) => void
  onScopeChange?: (scope: S) => void
  onCancel?: () => void

  // UI Configuration
  className?: string
  showFilter?: boolean
  activeScope?: S
  scopes?: S[]

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  renderScopeSelector?: (props: ScopeSelectorProps<S>) => React.ReactNode
}

/**
 * A generic component for displaying and selecting entities
 */
export function EntityReference<T extends BaseEntityProps, S = string>({
  // Data
  entities,
  selectedEntityId,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onCancel,

  className,
  showFilter = true,
  activeScope,
  scopes = [],

  // Custom renderers
  renderEntity,
  renderScopeSelector
}: EntityReferenceProps<T, S>): JSX.Element {
  const [selectedEntity, setSelectedEntity] = useState<T | undefined>(
    entities.find(entity => entity.id === selectedEntityId)
  )

  const handleSelectEntity = useCallback(
    (entity: T) => {
      setSelectedEntity(entity)
      onSelectEntity?.(entity)
    },
    [onSelectEntity]
  )

  const handleScopeChange = useCallback(
    (scope: S) => {
      onScopeChange?.(scope)
    },
    [onScopeChange]
  )

  const handleApply = useCallback(() => {
    if (selectedEntity) {
      onSelectEntity?.(selectedEntity)
    }
  }, [selectedEntity, onSelectEntity])

  // Default entity renderer
  const defaultEntityRenderer = ({ entity, isSelected, onSelect }: EntityRendererProps<T>) => {
    const hasSelectButton = 'type' in entity && entity.type === 'secret'

    return (
      <StackedListItem
        onClick={() => onSelect(entity)}
        className={cn(isSelected && 'bg-background-4')}
        thumbnail={<Icon name="file" size={16} className="text-foreground-5" />}
        actions={
          hasSelectButton ? (
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
          ) : undefined
        }
      >
        <StackedListField title={entity.name} />
      </StackedListItem>
    )
  }

  // Default scope selector renderer
  const defaultScopeSelectorRenderer = ({ scope, isActive, onSelect }: ScopeSelectorProps<S>) => {
    const iconName = typeof scope === 'string' && (scope.toLowerCase().includes('account') ? 'account' : 'folder')

    return (
      <StackedListItem
        onClick={() => onSelect(scope)}
        className={cn(isActive && 'bg-background-4 font-medium')}
        thumbnail={<Icon name={iconName as IconProps['name']} size={16} className="text-foreground-5" />}
      >
        <StackedListField title={<span className="capitalize">{String(scope)}</span>} />
      </StackedListItem>
    )
  }

  // Render the combined list (scopes + entities)
  const renderCombinedList = () => {
    return (
      <StackedList>
        {/* Render scopes at the top of the list */}
        {onScopeChange && scopes.length > 0 && (
          <>
            {scopes.map(scope => (
              <React.Fragment key={String(scope)}>
                {renderScopeSelector
                  ? renderScopeSelector({
                      scope,
                      isActive: scope === activeScope,
                      onSelect: handleScopeChange
                    })
                  : defaultScopeSelectorRenderer({
                      scope,
                      isActive: scope === activeScope,
                      onSelect: handleScopeChange
                    })}
              </React.Fragment>
            ))}
          </>
        )}

        {/* Render entities */}
        {entities.length > 0 ? (
          <>
            {entities.map(entity => {
              const isSelected = entity.id === selectedEntityId || entity === selectedEntity

              return (
                <React.Fragment key={entity.id}>
                  {renderEntity
                    ? renderEntity({
                        entity,
                        isSelected,
                        onSelect: handleSelectEntity
                      })
                    : defaultEntityRenderer({
                        entity,
                        isSelected,
                        onSelect: handleSelectEntity
                      })}
                </React.Fragment>
              )
            })}
          </>
        ) : (
          <StackedListItem disableHover>
            <StackedListField
              title={<div className="flex items-center justify-center h-32 text-foreground-4">No items available</div>}
            />
          </StackedListItem>
        )}
      </StackedList>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {showFilter && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 text-sm border rounded border-borders-2 bg-background-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      <div className="flex-1 overflow-auto">{renderCombinedList()}</div>

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
