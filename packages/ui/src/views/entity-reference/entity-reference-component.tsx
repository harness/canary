import React, { useCallback } from 'react'

import { Button, Icon, Input, ScrollArea } from '@/components'
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

export interface FolderRendererProps<F = string> {
  folder: F
  onSelect: (folder: F) => void
}

export interface EntityReferenceProps<T extends BaseEntityProps, S = string, F = string> {
  // Data
  entities: T[]
  selectedEntity: T | null
  activeScope?: S | null
  scopes?: S[]
  folders?: F[]

  // Callbacks
  onSelectEntity: (entity: T) => void
  onScopeChange: (scope: S) => void
  onFolderChange?: (folder: F, Scope: S) => void

  // UI Configuration
  showFilter?: boolean

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  renderScopeSelector?: (props: ScopeSelectorProps<S>) => React.ReactNode
  renderFolder?: (props: FolderRendererProps<F>) => React.ReactNode
}

export function EntityReference<T extends BaseEntityProps, S = string, F = string>({
  // Data
  entities,
  selectedEntity,
  activeScope,
  scopes = [],
  folders = [],

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onFolderChange,

  showFilter = true,

  // Custom renderers
  renderEntity,
  renderScopeSelector,
  renderFolder
}: EntityReferenceProps<T, S, F>): JSX.Element {
  const handleSelectEntity = useCallback(
    (entity: T) => {
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

  const handleFolderChange = useCallback(
    (folder: F, scope: S) => {
      onFolderChange?.(folder, scope)
    },
    [onFolderChange]
  )

  // Filter scopes based on hierarchy
  const getVisibleScopes = () => {
    if (!activeScope) {
      return scopes
    }

    const activeScopeIndex = scopes.findIndex(scope => scope === activeScope)

    if (activeScopeIndex === -1) {
      return scopes
    }

    return scopes.slice(0, activeScopeIndex)
  }

  const defaultEntityRenderer = ({ entity, isSelected, onSelect }: EntityRendererProps<T>) => {
    return (
      <StackedListItem
        onClick={() => onSelect?.(entity)}
        className={cn(isSelected && 'bg-background-4')}
        thumbnail={<Icon name="file" size={16} className="text-foreground-5" />}
        actions={
          <Button
            variant="default"
            size="sm"
            onClick={e => {
              e.stopPropagation()
              onSelect?.(entity)
            }}
          >
            Select
          </Button>
        }
      >
        <StackedListField title={entity.name} />
      </StackedListItem>
    )
  }

  // Default scope selector renderer
  const defaultScopeSelectorRenderer = ({ scope, isActive, onSelect }: ScopeSelectorProps<S>) => {
    return (
      <StackedListItem
        onClick={() => onSelect?.(scope)}
        className={cn(isActive && 'bg-background-4 font-medium')}
        thumbnail={<Icon name="circle-arrow-top" size={16} className="text-foreground-5" />}
      >
        <StackedListField title={<span className="capitalize">{String(scope)}</span>} />
      </StackedListItem>
    )
  }

  // Default folder renderer
  const defaultFolderRenderer = ({ folder, onSelect }: FolderRendererProps<F>) => {
    return (
      <StackedListItem
        onClick={() => onSelect?.(folder)}
        thumbnail={<Icon name="folder" size={16} className="text-foreground-5" />}
      >
        <StackedListField title={<span className="capitalize">{String(folder)}</span>} />
      </StackedListItem>
    )
  }

  const renderCombinedList = () => {
    const visibleScopes = getVisibleScopes()

    return (
      <StackedList>
        {/* scopes */}
        {visibleScopes.length > 0 && (
          <>
            {visibleScopes.map(scope => (
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

        {/* folders */}
        {folders.length > 0 && (
          <>
            {folders.map(folder => {
              const activeScopeIndex = scopes.findIndex(scope => scope === activeScope)
              return (
                <React.Fragment key={String(folder)}>
                  {renderFolder
                    ? renderFolder({
                        folder,
                        onSelect: () => handleFolderChange(folder, scopes[activeScopeIndex + 1])
                      })
                    : defaultFolderRenderer({
                        folder,
                        onSelect: () => handleFolderChange(folder, scopes[activeScopeIndex + 1])
                      })}
                </React.Fragment>
              )
            })}
          </>
        )}

        {/* entities */}
        {entities.length > 0 ? (
          <>
            {entities.map(entity => {
              const isSelected = entity.id === selectedEntity?.id

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
    <>
      {showFilter && <Input type="text" placeholder="Search" className="mb-4" />}
      <ScrollArea className="h-[62%]">
        <div className="flex-1">{renderCombinedList()}</div>
      </ScrollArea>
    </>
  )
}

export default EntityReference
