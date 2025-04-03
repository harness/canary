// TODO: we should rethink the approach and stop using the @dnd-kit library

import { useEffect, useState } from 'react'

import { DropdownMenu, Icon, Input } from '@/components'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useDragAndDrop from '@hooks/use-drag-and-drop'
import { cn } from '@utils/cn'

import type {
  FilterAction,
  FilterHandlers,
  FilterSearchQueries,
  SortDirection,
  SortOption,
  SortValue
} from '../../types'
import { getSortTriggerLabel } from '../../utils'

interface SortableItemProps {
  id: string
  sort: SortValue
  index: number
  onUpdateSort: FilterHandlers['handleUpdateSort']
  onRemoveSort: FilterHandlers['handleRemoveSort']
  sortOptions: SortOption[]
  sortDirections: SortDirection[]
}

const SortableItem = ({
  id,
  sort,
  index,
  onUpdateSort,
  onRemoveSort,
  sortOptions,
  sortDirections
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div className={cn('relative', isDragging && 'z-10')} ref={setNodeRef} style={style}>
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          <div
            className="cursor-grab rounded p-1 hover:bg-cn-background-3 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <Icon className="text-icons-1" name="grid-dots" size={12} />
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-6 items-center gap-x-1.5 rounded border border-cn-borders-2 pl-2.5 pr-1.5 text-14 text-cn-foreground-1">
              {sortOptions.find(opt => opt.value === sort.type)?.label}
              <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {sortOptions.map(option => (
                <DropdownMenu.Item
                  onSelect={() => onUpdateSort?.(index, { ...sort, type: option.value })}
                  key={option.value}
                >
                  {option.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-6 items-center gap-x-1.5 rounded border border-cn-borders-2 pl-2.5 pr-1.5 text-14 text-cn-foreground-1">
              {sortDirections.find(dir => dir.value === sort.direction)?.label}
              <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {sortDirections.map(direction => (
                <DropdownMenu.Item
                  onSelect={() => onUpdateSort?.(index, { ...sort, direction: direction.value })}
                  key={direction.value}
                >
                  {direction.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <button
          className="p-1 text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1 focus:bg-transparent"
          onClick={e => {
            e.preventDefault()
            onRemoveSort?.(index)
          }}
        >
          <Icon className="rotate-45" name="plus" size={12} />
        </button>
      </div>
    </div>
  )
}

interface SortsProps {
  activeSorts: SortValue[]
  sortOptions: SortOption[]
  handleUpdateSort: FilterHandlers['handleUpdateSort']
  handleSortChange: FilterHandlers['handleSortChange']
  handleRemoveSort: FilterHandlers['handleRemoveSort']
  handleResetSorts: FilterHandlers['handleResetSorts']
  handleReorderSorts: FilterHandlers['handleReorderSorts']
  searchQueries: FilterSearchQueries
  handleSearchChange: FilterHandlers['handleSearchChange']
  sortDirections: SortDirection[]
  filterToOpen: FilterAction | null
  onOpen?: () => void
}

const Sorts = ({
  activeSorts,
  sortOptions,
  handleUpdateSort,
  handleSortChange,
  handleRemoveSort,
  handleResetSorts,
  handleReorderSorts,
  searchQueries,
  handleSearchChange,
  sortDirections,
  filterToOpen,
  onOpen
}: SortsProps) => {
  const { handleDragEnd, getItemId } = useDragAndDrop({
    items: activeSorts,
    onReorder: handleReorderSorts
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (filterToOpen?.kind === 'sort' && !isOpen) {
      setIsOpen(true)
      onOpen?.()
    }
  }, [filterToOpen, isOpen, onOpen])

  const filteredBySearchSortOptions = sortOptions.filter(
    option => !searchQueries.menu.sort || option.label.toLowerCase().includes(searchQueries.menu.sort.toLowerCase())
  )

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger className="flex h-8 items-center gap-x-3 whitespace-nowrap rounded bg-cn-background-3 px-2.5 transition-colors duration-200 hover:bg-cn-background-8">
        <div className="flex items-center gap-x-1">
          <Icon
            className={cn('text-icons-1', getSortTriggerLabel(activeSorts, sortOptions).isDescending && 'rotate-180')}
            name={getSortTriggerLabel(activeSorts, sortOptions).icon}
            size={10}
          />
          <span className="text-13 text-cn-foreground-1">{getSortTriggerLabel(activeSorts, sortOptions).label}</span>
        </div>
        <Icon name="chevron-down" size={10} className="chevron-down" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-[310px] px-3 py-2.5" align="start">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext
            items={activeSorts.map((_, index) => getItemId(index))}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-y-2.5">
              {activeSorts.map((sort, index) => (
                <SortableItem
                  key={getItemId(index)}
                  id={getItemId(index)}
                  sort={sort}
                  index={index}
                  onUpdateSort={handleUpdateSort}
                  onRemoveSort={handleRemoveSort}
                  sortOptions={sortOptions}
                  sortDirections={sortDirections}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-3 flex flex-col gap-y-2.5">
          {sortOptions.some(option => !activeSorts.some(sort => sort.type === option.value)) && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex w-full items-center gap-x-1.5 text-14 text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1">
                <Icon name="plus" size={12} />
                Add sort
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="min-w-[224px] p-0" align="start">
                <div className="border-cn-borders-4 relative flex items-center justify-between border-b px-3 py-2.5">
                  <DropdownMenu.Item className="hover:bg-transparent focus:bg-transparent" asChild>
                    <Input
                      type="text"
                      placeholder="Sort by..."
                      value={searchQueries.menu.sort || ''}
                      onChange={e => handleSearchChange('sort', e.target.value, 'menu')}
                      onKeyDown={e => e.stopPropagation()}
                      onClick={e => e.preventDefault()}
                    />
                  </DropdownMenu.Item>

                  {searchQueries.menu['sort'] && (
                    <DropdownMenu.Item className="absolute right-3 hover:bg-transparent focus:bg-transparent" asChild>
                      <button
                        className="flex text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1"
                        onClick={e => {
                          e.preventDefault()
                          handleSearchChange('sort', '', 'menu')
                        }}
                      >
                        <Icon className="rotate-45" name="plus" size={12} />
                      </button>
                    </DropdownMenu.Item>
                  )}
                </div>
                <div className="p-1">
                  {filteredBySearchSortOptions
                    .filter(
                      option =>
                        !activeSorts.some(sort => sort.type === option.value) &&
                        option.label.toLowerCase().includes((searchQueries.menu.sort || '').toLowerCase())
                    )
                    .map(option => (
                      <DropdownMenu.Item
                        onSelect={() => handleSortChange({ type: option.value, direction: 'desc' })}
                        key={option.value}
                      >
                        {option.label}
                      </DropdownMenu.Item>
                    ))}

                  {filteredBySearchSortOptions.length === 0 && (
                    <div className="flex items-center justify-center p-4">
                      <span className="text-1 leading-none text-cn-foreground-2">No results</span>
                    </div>
                  )}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}

          <DropdownMenu.Item
            className="p-0 text-cn-foreground-2 transition-colors duration-200 focus:bg-transparent focus:text-cn-foreground-danger focus:outline-none data-[highlighted]:bg-transparent data-[highlighted]:text-cn-foreground-danger"
            asChild
          >
            <button className="flex items-center gap-x-1.5 text-14" onClick={handleResetSorts}>
              <Icon name="trash" size={12} />
              Delete sort
            </button>
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default Sorts
