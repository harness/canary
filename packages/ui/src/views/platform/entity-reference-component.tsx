import { useCallback } from 'react'

import { Button, Icon, Input, ScrollArea, SkeletonList, StackedList } from '@/components'
import { cn } from '@utils/cn'

import { EntityReferenceList } from './entity-reference-list'
import {
  BaseEntityProps,
  ChildFolderRendererProps,
  DirectionEnum,
  EntityRendererProps,
  ParentFolderRendererProps
} from './types'

export interface EntityReferenceProps<T extends BaseEntityProps, S = string, F = string> {
  // Data
  entities: T[]
  selectedEntity: T | null
  parentFolder: S | null
  childFolder: F | null
  currentFolder: string | null

  // Callbacks
  onSelectEntity: (entity: T) => void
  onScopeChange: (direction: DirectionEnum) => void

  // UI Configuration
  showFilter?: boolean
  showBreadcrumbEllipsis?: boolean

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  isLoading?: boolean

  // Error
  apiError?: string | null
}

export function EntityReference<T extends BaseEntityProps, S = string, F = string>({
  // Data
  entities,
  selectedEntity,
  parentFolder,
  childFolder,
  currentFolder,

  // Callbacks
  onSelectEntity,
  onScopeChange,

  // configs
  showFilter = true,
  showBreadcrumbEllipsis = false,

  // Custom renderers
  renderEntity,
  isLoading = false,

  // Error
  apiError
}: EntityReferenceProps<T, S, F>): JSX.Element {
  const handleSelectEntity = useCallback(
    (entity: T) => {
      onSelectEntity?.(entity)
    },
    [onSelectEntity]
  )

  const handleScopeChange = useCallback(
    (direction: DirectionEnum) => {
      onScopeChange?.(direction)
    },
    [onScopeChange]
  )

  const defaultEntityRenderer = ({ entity, isSelected, onSelect }: EntityRendererProps<T>) => {
    return (
      <StackedList.Item
        onClick={() => onSelect?.(entity)}
        className={cn({ 'bg-cn-background-hover': isSelected })}
        thumbnail={<Icon name="file" size={16} className="text-cn-foreground-3" />}
        actions={
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onSelect?.(entity)
            }}
          >
            Select
          </Button>
        }
      >
        <StackedList.Field title={entity.name} />
      </StackedList.Item>
    )
  }

  const parentFolderRenderer = ({ parentFolder, onSelect }: ParentFolderRendererProps<S>) => {
    return (
      <StackedList.Item
        onClick={() => onSelect?.(parentFolder)}
        thumbnail={<Icon name="folder" size={14} className="text-cn-foreground-3 ml-2" />}
        className="h-12 p-2"
      >
        <StackedList.Field title={<span className="capitalize">..</span>} />
      </StackedList.Item>
    )
  }

  const childFolderRenderer = ({ folder, onSelect }: ChildFolderRendererProps<F>) => {
    return (
      <StackedList.Item
        onClick={() => onSelect?.(folder)}
        thumbnail={<Icon name="folder" size={14} className="text-cn-foreground-3 ml-2" />}
        className="h-12 p-2"
      >
        <StackedList.Field title={<span className="capitalize">{String(folder)}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <div className="h-full">
          {showFilter && <Input type="text" placeholder="Search" className="mb-4" />}
          <ScrollArea className="h-3/4">
            <EntityReferenceList
              entities={entities}
              selectedEntity={selectedEntity}
              parentFolder={parentFolder}
              childFolder={childFolder}
              currentFolder={currentFolder}
              handleSelectEntity={handleSelectEntity}
              handleScopeChange={handleScopeChange}
              renderEntity={renderEntity}
              defaultEntityRenderer={defaultEntityRenderer}
              parentFolderRenderer={parentFolderRenderer}
              childFolderRenderer={childFolderRenderer}
              apiError={apiError}
              showBreadcrumbEllipsis={showBreadcrumbEllipsis}
            />
          </ScrollArea>
        </div>
      )}
    </>
  )
}

export default EntityReference
