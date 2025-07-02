import { useCallback } from 'react'

import { Button, Checkbox, IconPropsV2, IconV2, ListActions, SearchBox, SkeletonList, StackedList } from '@/components'
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
import { defaultEntityComparator } from './utils/utils'

export interface CommonEntityReferenceProps<T extends BaseEntityProps, S = string, F = string> {
  // Data
  entities: T[]
  parentFolder: S | null
  childFolder: F | null
  currentFolder: string | null
  selectedEntity?: T | null
  selectedEntities?: T[]

  // Callbacks
  onScopeChange: (direction: DirectionEnum) => void
  onFilterChange?: (filter: any) => void

  // UI Configuration
  showFilter?: boolean
  showBreadcrumbEllipsis?: boolean
  filterTypes?: Record<string, string>

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  isLoading?: boolean

  // Error
  apiError?: string | null

  // Search
  searchValue?: string
  handleChangeSearchValue: (val: string) => void

  // Icons for default entity renderer
  icon?: IconPropsV2['name']

  // Custom entity comparison
  compareFn?: (entity1: T, entity2: T) => boolean
}

export interface SingleSelectEntityReferenceProps<T extends BaseEntityProps, S = string, F = string>
  extends CommonEntityReferenceProps<T, S, F> {
  enableMultiSelect?: false
  onSelectEntity: (entity: T) => void
}

export interface MultiSelectEntityReferenceProps<T extends BaseEntityProps, S = string, F = string>
  extends CommonEntityReferenceProps<T, S, F> {
  enableMultiSelect: true
  onSelectEntity: (entities: T[]) => void
}

export type EntityReferenceProps<T extends BaseEntityProps, S = string, F = string> =
  | SingleSelectEntityReferenceProps<T, S, F>
  | MultiSelectEntityReferenceProps<T, S, F>

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
  enableMultiSelect,

  // Custom renderers
  renderEntity,
  isLoading = false,

  // Icons for default entity renderer
  icon,

  // Error
  apiError,

  // Search
  searchValue = '',
  handleChangeSearchValue,

  // Custom entity comparison
  compareFn
}: EntityReferenceProps<T, S, F>): JSX.Element {
  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue,
    searchValue
  })
  const handleSelectEntity = useCallback(
    (entity: T) => {
      if (enableMultiSelect) {
        // Use either the custom comparator or the default one
        const compareEntities = compareFn || defaultEntityComparator

        // Handle entity selection logic
        const isEntitySelected = selectedEntities.some(item => compareEntities(item, entity))
        const newSelectedEntities = isEntitySelected
          ? selectedEntities.filter(item => !compareEntities(item, entity))
          : [...selectedEntities, entity]

        onSelectEntity(newSelectedEntities)
      } else {
        onSelectEntity(entity)
      }
    },
    [onSelectEntity, enableMultiSelect, selectedEntities, compareFn]
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
            <IconV2 name={icon ?? 'page'} className="text-cn-foreground-3" />
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
        thumbnail={<IconV2 name="folder" size="xs" className="text-cn-foreground-3" />}
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
        thumbnail={<IconV2 name="folder" size="xs" className="text-cn-foreground-3" />}
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
          <EntityReferenceList<T, S, F>
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
            compareFn={compareFn}
          />
        )}
      </div>
    </>
  )
}

export default EntityReference
