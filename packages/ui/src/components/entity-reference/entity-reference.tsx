import { useCallback, useRef } from 'react'

import { Checkbox } from '../checkbox'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { SearchInput } from '../inputs'
import { StackedList } from '../stacked-list'
import { afterFrames } from '../../utils/after-frames'
import { cn } from '../../utils/cn'
import {
  BaseEntityProps,
  ChildFolderRendererProps,
  DirectionEnum,
  EntityRendererProps,
  ParentFolderRendererProps
} from '../../types/entity'
import { EntityReferenceFilter } from './entity-reference-filter'
import { EntityReferenceSort } from './entity-reference-sort'
import { EntityReferenceList } from './entity-reference-list'
import { defaultEntityComparator } from './entity-utils'

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
  onFilterChange?: (filter: string) => void
  onFavoriteChange?: (favorite: boolean) => void

  // UI Configuration
  showFilter?: boolean
  showSort?: boolean
  enableFavorite?: boolean
  showBreadcrumbEllipsis?: boolean
  filterTypes?: Record<string, string>

  // Custom renderers
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  isLoading?: boolean

  // Search
  searchValue?: string
  handleChangeSearchValue: (val: string) => void

  // Custom entity comparison
  compareFn?: (entity1: T, entity2: T) => boolean

  paginationProps?: {
    handleLoadMore: () => void
    isLastPage?: boolean
    isLoading?: boolean
  }
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
  onFavoriteChange,

  // configs
  showFilter = true,
  showSort = false,
  enableFavorite = true,
  showBreadcrumbEllipsis = false,
  filterTypes,
  enableMultiSelect,

  // Custom renderers
  renderEntity,
  isLoading = false,

  // Search
  searchValue = '',
  handleChangeSearchValue,

  // Custom entity comparison
  compareFn,

  // Pagination
  paginationProps
}: EntityReferenceProps<T, S, F>): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

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
      afterFrames(() => inputRef.current?.focus())
    },
    [onScopeChange]
  )

  const defaultEntityRenderer = ({ entity, isSelected, onSelect, showCheckbox }: EntityRendererProps<T>) => {
    return (
      <StackedList.Item
        className={cn({ 'bg-cn-selected first:!rounded-cn-none min-h-12': isSelected })}
        paddingY="xs"
        onClick={() => onSelect?.(entity)}
        thumbnail={showCheckbox ? <Checkbox checked={isSelected} onCheckedChange={() => onSelect?.(entity)} /> : null}
      >
        <StackedList.Field title={entity.name} />
      </StackedList.Item>
    )
  }

  const parentFolderRenderer = ({ parentFolder, onSelect }: ParentFolderRendererProps<S>) => {
    if (!parentFolder) return null
    return (
      <StackedList.Item
        paddingY="xs"
        className="gap-x-cn-xs min-h-12 first:!rounded-cn-none"
        onClick={() => onSelect?.(parentFolder)}
        thumbnail={<IconV2 name="folder" size="md" className="text-cn-2" />}
      >
        <StackedList.Field title=".." />
      </StackedList.Item>
    )
  }

  const childFolderRenderer = ({ folder, onSelect }: ChildFolderRendererProps<F>) => {
    if (!folder) return null
    return (
      <StackedList.Item
        paddingY="xs"
        className="gap-x-cn-xs min-h-12 first:!rounded-cn-none"
        onClick={() => onSelect?.(folder)}
        thumbnail={<IconV2 name="folder" size="md" className="text-cn-2" />}
      >
        <StackedList.Field className="grid capitalize" title={String(folder)} />
      </StackedList.Item>
    )
  }

  return (
    <>
      <Layout.Vertical gapY="lg">
        <Layout.Horizontal gapX="sm">
          <SearchInput
            ref={inputRef}
            width="full"
            className={cn({ 'max-w-96': filterTypes })}
            defaultValue={searchValue}
            onChange={handleChangeSearchValue}
            placeholder="Search"
            autoFocus
          />
          {showSort && (
            <EntityReferenceSort
              onSortChange={onFilterChange}
              onFavoriteChange={onFavoriteChange}
              enableFavorite={enableFavorite}
            />
          )}
          {showFilter && filterTypes && (
            <EntityReferenceFilter onFilterChange={onFilterChange} filterTypes={filterTypes} defaultValue={'all'} />
          )}
        </Layout.Horizontal>
        <>
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
            showBreadcrumbEllipsis={showBreadcrumbEllipsis}
            enableMultiSelect={enableMultiSelect}
            compareFn={compareFn}
            isLoading={isLoading}
            paginationProps={paginationProps}
          />
        </>
      </Layout.Vertical>
    </>
  )
}

export default EntityReference
