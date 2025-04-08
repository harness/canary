import { Fragment } from 'react'

import { Breadcrumb, StackedList } from '@/components'

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
  handleSelectEntity: (entity: T) => void
  handleScopeChange: (direction: DirectionEnum) => void
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  defaultEntityRenderer: (props: EntityRendererProps<T>) => React.ReactNode
  parentFolderRenderer: (props: ParentFolderRendererProps<S>) => React.ReactNode
  childFolderRenderer: (props: ChildFolderRendererProps<F>) => React.ReactNode
  apiError?: string | null
  /** Scope path for breadcrumbs (e.g. ["account", "org", "project"]) */
  onBreadcrumbClick?: (index: number) => void
}

export function EntityReferenceList<T extends BaseEntityProps, S = string, F = string>({
  entities,
  selectedEntity,
  parentFolder,
  childFolder,
  handleSelectEntity,
  handleScopeChange,
  renderEntity,
  defaultEntityRenderer,
  parentFolderRenderer,
  childFolderRenderer,
  apiError,
  onBreadcrumbClick
}: EntityReferenceListProps<T, S, F>): JSX.Element {
  return (
    <StackedList.Root>
      {/* Breadcrumb header */}
      <StackedList.Item isHeader disableHover className="bg-cn-background-2">
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <>
                <Breadcrumb.Link className="cursor-pointer capitalize">{parentFolder}</Breadcrumb.Link>
                <Breadcrumb.Separator />
              </>
            </Breadcrumb.Item>
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
