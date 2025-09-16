import { useCallback } from 'react'

import { Checkbox, IconV2, Layout, SearchInput, Skeleton, StackedList } from '@/components'
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
  onFilterChange?: (filter: string) => void

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

  // Error
  apiError,

  // Search
  searchValue = '',
  handleChangeSearchValue,

  // Custom entity comparison
  compareFn
}: EntityReferenceProps<T, S, F>): JSX.Element {
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
        className={cn({ 'bg-cn-selected': isSelected })}
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
        className="gap-x-cn-xs"
        onClick={() => onSelect?.(parentFolder)}
        thumbnail={<IconV2 name="folder" size="md" className="text-cn-2" />}
      >
        <StackedList.Field title="..." />
      </StackedList.Item>
    )
  }

  const childFolderRenderer = ({ folder, onSelect }: ChildFolderRendererProps<F>) => {
    if (!folder) return null
    return (
      <StackedList.Item
        paddingY="xs"
        className="gap-x-cn-xs"
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
        {showFilter && (
          <Layout.Horizontal gapX="sm">
            <SearchInput
              width="full"
              className={cn({ 'max-w-96': filterTypes })}
              value={searchValue}
              onChange={handleChangeSearchValue}
              placeholder="Search"
            />
            {filterTypes && (
              <EntityReferenceFilter onFilterChange={onFilterChange} filterTypes={filterTypes} defaultValue={'all'} />
            )}
          </Layout.Horizontal>
        )}
        {isLoading ? (
          <Skeleton.List />
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
      </Layout.Vertical>
    </>
  )
}

export default EntityReference
