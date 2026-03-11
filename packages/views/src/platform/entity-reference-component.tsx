import { useCallback, useRef } from 'react'

import { Button, Checkbox, IconV2, Layout, SearchInput, StackedList, Tabs } from '@harnessio/ui/components'
import { afterFrames, cn } from '@harnessio/ui/utils'

import { EntityReferenceFilter } from './components/entity-reference-filter'
import { EntityReferenceSort } from './components/entity-reference-sort'
import { EntityReferenceList } from './entity-reference-list'
import { BaseEntityProps, EntityRendererProps, EntityReferenceScope } from './types'
import { defaultEntityComparator } from './utils/utils'

export interface CommonEntityReferenceProps<T extends BaseEntityProps> {
  // Data
  entities: T[]
  selectedScope: EntityReferenceScope
  selectedEntity?: T | null
  selectedEntities?: T[]

  // Callbacks
  onScopeChange: (scope: EntityReferenceScope) => void
  onFilterChange?: (filter: string) => void
  onFavoriteChange?: (favorite: boolean) => void
  onCreateClick?: () => void

  // UI Configuration
  showFilter?: boolean
  showSort?: boolean
  enableFavorite?: boolean
  filterTypes?: Record<string, string>
  createBtnTitle?: string

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

export interface SingleSelectEntityReferenceProps<T extends BaseEntityProps>
  extends CommonEntityReferenceProps<T> {
  enableMultiSelect?: false
  onSelectEntity: (entity: T) => void
}

export interface MultiSelectEntityReferenceProps<T extends BaseEntityProps> extends CommonEntityReferenceProps<T> {
  enableMultiSelect: true
  onSelectEntity: (entities: T[]) => void
}

export type EntityReferenceProps<T extends BaseEntityProps> =
  | SingleSelectEntityReferenceProps<T>
  | MultiSelectEntityReferenceProps<T>

export function EntityReference<T extends BaseEntityProps>({
  // Data
  entities,
  selectedEntity,
  selectedEntities = [],
  selectedScope,

  // Callbacks
  onSelectEntity,
  onScopeChange,
  onFilterChange,
  onFavoriteChange,
  onCreateClick,

  // configs
  showFilter = true,
  showSort = false,
  enableFavorite = true,
  filterTypes,
  enableMultiSelect,
  createBtnTitle,

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
}: EntityReferenceProps<T>): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelectEntity = useCallback(
    (entity: T) => {
      if (enableMultiSelect) {
        const compareEntities = compareFn || defaultEntityComparator

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

  const handleScopeChangeInternal = useCallback(
    (scope: EntityReferenceScope) => {
      onScopeChange(scope)
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

  const scopeLabels: Record<EntityReferenceScope, string> = {
    account: 'Account',
    org: 'Organization',
    project: 'Project'
  }

  const scopes: EntityReferenceScope[] = [EntityReferenceScope.ACCOUNT, EntityReferenceScope.ORG, EntityReferenceScope.PROJECT]

  return (
    <Layout.Vertical>
      <Tabs.Root
        value={selectedScope}
        onValueChange={value => handleScopeChangeInternal(value as EntityReferenceScope)}
        className="w-full"
      >
        <Tabs.List variant="outlined" className="w-full">
          {scopes.map(scope => (
            <Tabs.Trigger key={scope} value={scope} className="flex-1 justify-center">
              {scopeLabels[scope]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Layout.Horizontal className="items-center justify-between">
        <Layout.Horizontal className="flex-1">
          <SearchInput
            ref={inputRef}
            width="full"
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
            <EntityReferenceFilter onFilterChange={onFilterChange} filterTypes={filterTypes} defaultValue="all" />
          )}
        </Layout.Horizontal>

        {onCreateClick && (
          <Button variant="outline" onClick={onCreateClick}>
            <IconV2 name="plus" size="sm" />
            {createBtnTitle || 'Create'}
          </Button>
        )}
      </Layout.Horizontal>

      <EntityReferenceList<T>
        entities={entities}
        selectedEntity={selectedEntity}
        selectedEntities={selectedEntities}
        handleSelectEntity={handleSelectEntity}
        renderEntity={renderEntity}
        defaultEntityRenderer={defaultEntityRenderer}
        enableMultiSelect={enableMultiSelect}
        compareFn={compareFn}
        isLoading={isLoading}
        paginationProps={paginationProps}
      />
    </Layout.Vertical>
  )
}

export default EntityReference
