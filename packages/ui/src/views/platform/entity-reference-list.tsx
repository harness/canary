import { Fragment } from 'react'

import { Breadcrumb, IconV2, ScrollArea, StackedList, Text } from '@/components'
import { cn } from '@utils/cn'

import {
  BaseEntityProps,
  ChildFolderRendererProps,
  DirectionEnum,
  EntityRendererProps,
  ParentFolderRendererProps
} from './types'
import { defaultEntityComparator } from './utils/utils'

export interface EntityReferenceListProps<T extends BaseEntityProps, S = string, F = string> {
  entities: T[]
  selectedEntity?: T | null
  selectedEntities?: T[]
  parentFolder: S | null
  childFolder: F | null
  currentFolder: string | null
  handleSelectEntity: (entity: T) => void
  handleScopeChange: (direction: DirectionEnum) => void
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  defaultEntityRenderer: (props: EntityRendererProps<T>) => React.ReactNode
  parentFolderRenderer: (props: ParentFolderRendererProps<S>) => React.ReactNode
  childFolderRenderer: (props: ChildFolderRendererProps<F>) => React.ReactNode
  apiError?: string | null
  showBreadcrumbEllipsis?: boolean
  enableMultiSelect?: boolean
  compareFn?: (entity1: T, entity2: T) => boolean
}

export function EntityReferenceList<T extends BaseEntityProps, S = string, F = string>({
  entities,
  selectedEntity,
  selectedEntities = [],
  parentFolder,
  childFolder,
  currentFolder,
  handleSelectEntity,
  handleScopeChange,
  renderEntity,
  defaultEntityRenderer,
  parentFolderRenderer,
  childFolderRenderer,
  apiError,
  showBreadcrumbEllipsis = false,
  enableMultiSelect = false,
  compareFn
}: EntityReferenceListProps<T, S, F>): JSX.Element {
  return (
    <StackedList.Root>
      {/* Breadcrumb header */}
      <StackedList.Item isHeader disableHover className="sticky top-0 h-12 !bg-cn-background-3 p-2">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {showBreadcrumbEllipsis ? (
              <>
                <Breadcrumb.Item>
                  <Breadcrumb.Ellipsis className="ml-1 h-0 w-4" />
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <IconV2 name="nav-arrow-right" size="2xs" className="scale-75" />
                </Breadcrumb.Separator>
              </>
            ) : null}
            {parentFolder ? (
              <>
                <Breadcrumb.Item className={cn('items-center justify-center', { 'ml-1': !showBreadcrumbEllipsis })}>
                  <Breadcrumb.Link className="cursor-pointer" onClick={() => handleScopeChange(DirectionEnum.PARENT)}>
                    <Text variant="body-normal">{parentFolder}</Text>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <IconV2 name="nav-arrow-right" size="2xs" className="scale-75" />
                </Breadcrumb.Separator>
              </>
            ) : null}
            <Breadcrumb.Page className={cn('cursor-pointer', { 'ml-1': !parentFolder })}>
              <Text variant="body-normal">{currentFolder}</Text>
            </Breadcrumb.Page>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </StackedList.Item>

      <ScrollArea className="max-h-[calc(100vh-530px)] overflow-y-auto">
        {/* scopes */}
        {parentFolder ? (
          <>
            {parentFolderRenderer({
              parentFolder,
              onSelect: () => handleScopeChange(DirectionEnum.PARENT)
            })}
          </>
        ) : null}

        {/* folders */}
        {childFolder ? (
          <>
            {childFolderRenderer({
              folder: childFolder,
              onSelect: () => handleScopeChange(DirectionEnum.CHILD)
            })}
          </>
        ) : null}

        {/* entities */}
        {entities.length > 0 ? (
          <>
            {entities.map(entity => {
              // Use either the custom comparator or the default one
              const compareEntities = compareFn || defaultEntityComparator

              const isSelected =
                selectedEntities.length > 0
                  ? selectedEntities.some(item => compareEntities(item, entity))
                  : selectedEntity
                    ? compareEntities(selectedEntity, entity)
                    : false

              return (
                <Fragment key={entity.id}>
                  {renderEntity
                    ? renderEntity({
                        entity,
                        isSelected,
                        onSelect: () => handleSelectEntity(entity),
                        showCheckbox: enableMultiSelect
                      })
                    : defaultEntityRenderer({
                        entity,
                        isSelected,
                        onSelect: () => handleSelectEntity(entity),
                        showCheckbox: enableMultiSelect
                      })}
                </Fragment>
              )
            })}
          </>
        ) : (
          <StackedList.Item>
            <StackedList.Field title={apiError || 'No entities found'} />
          </StackedList.Item>
        )}
      </ScrollArea>
    </StackedList.Root>
  )
}
