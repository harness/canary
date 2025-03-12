import { Fragment } from 'react'

import { StackedList } from '@/components'

import { BaseEntityProps, DirectionEnum, EntityRendererProps, FolderRendererProps, ScopeSelectorProps } from './types'

export interface EntityReferenceListProps<T extends BaseEntityProps, S = string, F = string> {
  entities: T[]
  selectedEntity: T | null
  parentFolder: S | null
  childFolder: F | null
  handleSelectEntity: (entity: T) => void
  handleScopeChange: (direction: DirectionEnum) => void
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  defaultEntityRenderer: (props: EntityRendererProps<T>) => React.ReactNode
  parentFolderRenderer: (props: ScopeSelectorProps<S>) => React.ReactNode
  childFolderRenderer: (props: FolderRendererProps<F>) => React.ReactNode
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
  childFolderRenderer
}: EntityReferenceListProps<T, S, F>): JSX.Element {
  return (
    <StackedList.Root>
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
                      onSelect: handleSelectEntity
                    })
                  : defaultEntityRenderer({
                      entity,
                      isSelected,
                      onSelect: handleSelectEntity
                    })}
              </Fragment>
            )
          })}
        </>
      ) : (
        <StackedList.Item disableHover>
          <StackedList.Field
            title={<div className="text-foreground-4 flex h-32 items-center justify-center">No items available</div>}
          />
        </StackedList.Item>
      )}
    </StackedList.Root>
  )
}
