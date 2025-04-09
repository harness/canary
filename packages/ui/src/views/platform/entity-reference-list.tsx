import { Fragment } from 'react'

import { Breadcrumb, Icon, ScrollArea, StackedList } from '@/components'

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
  console.log(showBreadcrumbEllipsis)
  return (
    <StackedList.Root>
      {/* Breadcrumb header */}
      <StackedList.Item isHeader disableHover className="!bg-cn-background-3 sticky top-0 h-12 p-2">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {showBreadcrumbEllipsis ? (
              <Breadcrumb.Item>
                <Breadcrumb.Ellipsis className="ml-3 w-4" />
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={6} className="scale-75" />
                </Breadcrumb.Separator>
              </Breadcrumb.Item>
            ) : null}
            {parentFolder ? (
              <Breadcrumb.Item className="items-center justify-center">
                <Breadcrumb.Link
                  className="cursor-pointer text-xs"
                  onClick={() => handleScopeChange(DirectionEnum.PARENT)}
                >
                  {parentFolder}
                </Breadcrumb.Link>
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={6} className="scale-75" />
                </Breadcrumb.Separator>
              </Breadcrumb.Item>
            ) : null}
            <Breadcrumb.Page className="cursor-pointer text-xs">{currentFolder}</Breadcrumb.Page>
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
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 h-32 bg-gradient-to-t from-[hsla(240,8%,6%,1)] via-[hsla(240,8%,6%,0.8)] to-[hsla(240,8%,6%,0)]"></div>
    </StackedList.Root>
  )
}
