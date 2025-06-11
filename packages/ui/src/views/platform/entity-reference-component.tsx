import { useCallback } from 'react'

import { Button, Checkbox, IconV2, ListActions, SearchBox, SkeletonList, StackedList } from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'

import { EntityReferenceFilter } from './components/entity-reference-filter'
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
  selectedEntities?: T[]
  parentFolder: S | null
  childFolder: F | null
  currentFolder: string | null

  // Callbacks
  onSelectEntity: ((entity: T) => void) | ((entities: T[]) => void)
  onScopeChange: (direction: DirectionEnum) => void
  onFilterChange?: (filter: string) => void

  // UI Configuration
  showFilter?: boolean
  showBreadcrumbEllipsis?: boolean
  filterTypes?: Record<string, string>
  enableMultiSelect?: boolean

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  isLoading?: boolean

  // Error
  apiError?: string | null

  // Search
  searchValue?: string
  handleChangeSearchValue: (val: string) => void
}

export function EntityReference<T extends BaseEntityProps, S = string, F = string>({
  // Data
  entities,
  selectedEntity,
  selectedEntities = [],
  parentFolder,
  childFolder,
  currentFolder,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onFilterChange,

  // configs
  showFilter = true,
  showBreadcrumbEllipsis = false,
  filterTypes,
  enableMultiSelect = false,

  // Custom renderers
  renderEntity,
  isLoading = false,

  // Error
  apiError,

  // Search
  searchValue = '',
  handleChangeSearchValue
}: EntityReferenceProps<T, S, F>): JSX.Element {
  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue,
    searchValue
  })
  const handleSelectEntity = useCallback(
    (entity: T) => {
      if (enableMultiSelect) {
        const isEntitySelected = selectedEntities.some(item => item.id === entity.id)
        const newSelectedEntities = isEntitySelected
          ? selectedEntities.filter(item => item.id !== entity.id)
          : [...selectedEntities, entity]

        // Cast to handle both function signatures
        ;(onSelectEntity as (entities: T[]) => void)(newSelectedEntities)
      } else {
        // Cast to handle both function signatures
        ;(onSelectEntity as (entity: T) => void)(entity)
      }
    },
    [onSelectEntity, enableMultiSelect, selectedEntities]
  )

  const handleScopeChange = useCallback(
    (direction: DirectionEnum) => {
      onScopeChange?.(direction)
    },
    [onScopeChange]
  )

  const defaultEntityRenderer = ({ entity, isSelected, onSelect, showCheckbox }: EntityRendererProps<T>) => {
    return (
      <StackedList.Item
        onClick={() => onSelect?.(entity)}
        className={cn('h-12 p-3', { 'bg-cn-background-hover': isSelected })}
        thumbnail={
          showCheckbox ? (
            <Checkbox checked={isSelected} onCheckedChange={() => onSelect?.(entity)} />
          ) : (
            <IconV2 name="page" className="text-cn-foreground-3" />
          )
        }
        actions={
          !showCheckbox && (
            <Button
              size="sm"
              onClick={() => {
                onSelect?.(entity)
              }}
            >
              Select
            </Button>
          )
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
        thumbnail={<IconV2 name="folder" size={14} className="text-cn-foreground-3" />}
        className="h-12 p-3"
      >
        <StackedList.Field title={<span className="capitalize">..</span>} />
      </StackedList.Item>
    )
  }

  const childFolderRenderer = ({ folder, onSelect }: ChildFolderRendererProps<F>) => {
    return (
      <StackedList.Item
        onClick={() => onSelect?.(folder)}
        thumbnail={<IconV2 name="folder" size={14} className="text-cn-foreground-3" />}
        className="h-12 p-3"
      >
        <StackedList.Field title={<span className="capitalize">{String(folder)}</span>} />
      </StackedList.Item>
    )
  }

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        {showFilter && (
          <ListActions.Root className="gap-2">
            <ListActions.Left>
              <SearchBox.Root
                width="full"
                className={cn({ 'max-w-96': filterTypes })}
                value={search}
                handleChange={handleSearchChange}
                placeholder="Search"
              />
            </ListActions.Left>
            {filterTypes && (
              <ListActions.Right>
                <EntityReferenceFilter onFilterChange={onFilterChange} filterTypes={filterTypes} defaultValue={'all'} />
              </ListActions.Right>
            )}
          </ListActions.Root>
        )}
        {isLoading ? (
          <SkeletonList />
        ) : (
          <EntityReferenceList
            entities={entities}
            selectedEntity={selectedEntity}
            selectedEntities={selectedEntities}
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
            enableMultiSelect={enableMultiSelect}
          />
        )}
      </div>
    </>
  )
}

export default EntityReference
