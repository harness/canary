import { Fragment } from 'react'

import { Button, ScrollArea, Skeleton, StackedList } from '@harnessio/ui/components'

import { BaseEntityProps, EntityRendererProps } from './types'
import { defaultEntityComparator } from './utils/utils'

export interface EntityReferenceListProps<T extends BaseEntityProps> {
  entities: T[]
  selectedEntity?: T | null
  selectedEntities?: T[]
  handleSelectEntity: (entity: T) => void
  renderEntity?: (props: EntityRendererProps<T>) => React.ReactNode
  defaultEntityRenderer: (props: EntityRendererProps<T>) => React.ReactNode
  enableMultiSelect?: boolean
  compareFn?: (entity1: T, entity2: T) => boolean
  isLoading: boolean
  paginationProps?: {
    handleLoadMore: () => void
    isLastPage?: boolean
    isLoading?: boolean
  }
}

export function EntityReferenceList<T extends BaseEntityProps>({
  entities,
  selectedEntity,
  selectedEntities = [],
  handleSelectEntity,
  renderEntity,
  defaultEntityRenderer,
  enableMultiSelect = false,
  compareFn,
  isLoading,
  paginationProps
}: EntityReferenceListProps<T>): JSX.Element {
  return (
    <StackedList.Root>
      <ScrollArea className="max-h-[calc(100vh-530px)]">
        {isLoading ? (
          <Skeleton.List />
        ) : entities.length > 0 ? (
          <>
            {entities.map(entity => {
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
            {paginationProps?.handleLoadMore && !paginationProps?.isLastPage && (
              <StackedList.Item disableHover className="flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={paginationProps?.handleLoadMore}
                  loading={paginationProps?.isLoading}
                  size="sm"
                >
                  Load more
                </Button>
              </StackedList.Item>
            )}
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
