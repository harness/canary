import { Fragment } from 'react'

import { Breadcrumb, ScrollArea, StackedList } from '@/components'

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
  showBreadcrumbEllipsis = false,
  enableMultiSelect = false,
  compareFn
}: EntityReferenceListProps<T, S, F>): JSX.Element {
  return (
    <StackedList.Root>
      {/* Breadcrumb header */}
      <StackedList.Header className="sticky top-0" paddingY="sm">
        <Breadcrumb.Root className="font-body-normal">
          <Breadcrumb.List>
            {!!showBreadcrumbEllipsis && (
              <>
                <Breadcrumb.Ellipsis className="text-cn-disabled" />
                <Breadcrumb.Separator className="text-cn-disabled" />
              </>
            )}
            {!!parentFolder && (
              <>
                <Breadcrumb.Item className="text-cn-3 hover:!text-cn-1">
                  <Breadcrumb.Link
                    onClick={e => {
                      e.preventDefault()
                      handleScopeChange(DirectionEnum.PARENT)
                    }}
                    href="#"
                  >
                    {parentFolder}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator className="text-cn-disabled" />
              </>
            )}
            <Breadcrumb.Page className="last:!text-cn-1 text-cn-3 hover:!text-cn-1">{currentFolder}</Breadcrumb.Page>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </StackedList.Header>

      <ScrollArea className="max-h-[calc(100vh-530px)]">
        {/* scopes */}
        {parentFolderRenderer({ parentFolder, onSelect: () => handleScopeChange(DirectionEnum.PARENT) })}

        {/* folders */}
        {childFolderRenderer({ folder: childFolder, onSelect: () => handleScopeChange(DirectionEnum.CHILD) })}

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
          <StackedList.Item disableHover>
            <StackedList.Field title="No entities found" titleColor="foreground-3" />
          </StackedList.Item>
        )}
      </ScrollArea>
    </StackedList.Root>
  )
}
