import { Fragment } from 'react'

import { Breadcrumb, Icon, ScrollArea, StackedList } from '@/components'
import { cn } from '@utils/cn'

import {
  BaseEntityProps,
  ChildFolderRendererProps,
  DirectionEnum,
  EntityRendererProps,
  ParentFolderRendererProps
} from './types'

export interface EntityReferenceListProps<T extends BaseEntityProps, S = string, F = string> {
  entities: T[]
  selectedEntity: T | null
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
}

export function EntityReferenceList<T extends BaseEntityProps, S = string, F = string>({
  entities,
  selectedEntity,
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
  showBreadcrumbEllipsis = false
}: EntityReferenceListProps<T, S, F>): JSX.Element {
  return (
    <StackedList.Root>
      {/* Breadcrumb header */}
      <StackedList.Item isHeader disableHover className="!bg-cn-background-3 sticky top-0 h-12 p-2">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {showBreadcrumbEllipsis ? (
              <>
                <Breadcrumb.Item>
                  <Breadcrumb.Ellipsis className="ml-1 h-0 w-4" />
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={6} className="scale-75" />
                </Breadcrumb.Separator>
              </>
            ) : null}
            {parentFolder ? (
              <>
                <Breadcrumb.Item className={cn('items-center justify-center', { 'ml-1': !showBreadcrumbEllipsis })}>
                  <Breadcrumb.Link
                    className="cursor-pointer text-xs"
                    onClick={() => handleScopeChange(DirectionEnum.PARENT)}
                  >
                    {parentFolder}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={6} className="scale-75" />
                </Breadcrumb.Separator>
              </>
            ) : null}
            <Breadcrumb.Page className={cn('cursor-pointer text-xs', { 'ml-1': !parentFolder })}>
              {currentFolder}
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
              const isSelected = entity.id === selectedEntity?.id

              return (
                <Fragment key={entity.id}>
                  {renderEntity
                    ? renderEntity({
                        entity,
                        isSelected,
                        onSelect: () => handleSelectEntity(entity)
                      })
                    : defaultEntityRenderer({
                        entity,
                        isSelected,
                        onSelect: () => handleSelectEntity(entity)
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
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 h-32 bg-gradient-to-t from-cn-background-1 via-cn-background-1/80 to-cn-background-1/0"></div>
    </StackedList.Root>
  )
}
