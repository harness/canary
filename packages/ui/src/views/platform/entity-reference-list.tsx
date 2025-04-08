import { Fragment } from 'react'

import { Breadcrumb, Icon, StackedList } from '@/components'

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
                <Breadcrumb.Ellipsis className="ml-2 w-4" />
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={4} className="min-h-0 min-w-0" />
                </Breadcrumb.Separator>
              </Breadcrumb.Item>
            ) : null}
            {parentFolder ? (
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  className="cursor-pointer text-xs"
                  onClick={() => handleScopeChange(DirectionEnum.PARENT)}
                >
                  {parentFolder}
                </Breadcrumb.Link>
                <Breadcrumb.Separator>
                  <Icon name="chevron-right" size={4} />
                </Breadcrumb.Separator>
              </Breadcrumb.Item>
            ) : null}
            <Breadcrumb.Item className="cursor-pointer text-xs">{currentFolder}</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </StackedList.Item>

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
    </StackedList.Root>
  )
}
