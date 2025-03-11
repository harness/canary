import React, { useCallback } from 'react'

import { Button, Icon, Input, ScrollArea } from '@/components'
import { Root as StackedList, Field as StackedListField, Item as StackedListItem } from '@/components/stacked-list'
import { cn } from '@utils/cn'
import { DirectoryType } from '@views/secrets'

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
  parentFolder: S
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
  parentFolder: S | null
  childFolder: F | null

  // Callbacks
  onSelectEntity: (entity: T) => void
  onScopeChange: (direction: DirectoryType) => void

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
  parentFolder,
  childFolder,

  // Callbacks
  onSelectEntity,
  onScopeChange,

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
    (direction: DirectoryType) => {
      onScopeChange?.(direction)
    },
    [onScopeChange]
  )

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
  const defaultScopeSelectorRenderer = ({ parentFolder, onSelect }: ScopeSelectorProps<S>) => {
    return (
      <StackedListItem
        onClick={() => onSelect?.(parentFolder)}
        thumbnail={<Icon name="circle-arrow-top" size={16} className="text-foreground-5" />}
      >
        <StackedListField title={<span className="capitalize">{String(parentFolder)}</span>} />
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
    return (
      <StackedList>
        {/* scopes */}
        {parentFolder && (
          <>
            {renderScopeSelector
              ? renderScopeSelector({
                  parentFolder,
                  onSelect: () => handleScopeChange(DirectoryType.UP)
                })
              : defaultScopeSelectorRenderer({
                  parentFolder,
                  onSelect: () => handleScopeChange(DirectoryType.UP)
                })}
          </>
        )}

        {/* folders */}
        {childFolder && (
          <>
            {renderFolder
              ? renderFolder({
                  folder: childFolder,
                  onSelect: () => handleScopeChange(DirectoryType.DOWN)
                })
              : defaultFolderRenderer({
                  folder: childFolder,
                  onSelect: () => handleScopeChange(DirectoryType.DOWN)
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
              title={<div className="text-foreground-4 flex h-32 items-center justify-center">No items available</div>}
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
