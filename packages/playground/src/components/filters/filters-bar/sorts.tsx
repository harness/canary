import { useEffect, useState } from 'react'

import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Input
} from '@harnessio/canary'

import useDragAndDrop from '../../../hooks/use-drag-and-drop'
import type { FilterAction, FilterSearchQueries, SortDirection, SortOption, SortValue } from '../types'
import { UseFiltersReturn } from '../use-filters'
import { getSortTriggerLabel } from '../utils'

interface SortableItemProps {
  id: string
  sort: SortValue
  index: number
  onUpdateSort: UseFiltersReturn['handleUpdateSort']
  onRemoveSort: UseFiltersReturn['handleRemoveSort']
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
            className="cursor-grab rounded p-1 hover:bg-background-3 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <Icon className="text-icons-1" name="grid-dots" size={12} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-6 items-center gap-x-1.5 rounded border border-borders-1 pl-2.5 pr-1.5 text-14 text-foreground-8">
              {sortOptions.find(opt => opt.value === sort.type)?.label}
              <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map(option => (
                <DropdownMenuItem
                  onSelect={() => onUpdateSort?.(index, { ...sort, type: option.value })}
                  key={option.value}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-6 items-center gap-x-1.5 rounded border border-borders-1 pl-2.5 pr-1.5 text-14 text-foreground-8">
              {sortDirections.find(dir => dir.value === sort.direction)?.label}
              <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortDirections.map(direction => (
                <DropdownMenuItem
                  onSelect={() => onUpdateSort?.(index, { ...sort, direction: direction.value })}
                  key={direction.value}
                >
                  {direction.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenuItem className="p-0" asChild>
          <button
            className="p-1 text-foreground-4 transition-colors duration-200 hover:text-foreground-1 focus:bg-transparent"
            onClick={e => {
              e.preventDefault()
              onRemoveSort?.(index)
            }}
          >
            <Icon className="rotate-45" name="plus" size={12} />
          </button>
        </DropdownMenuItem>
      </div>
    </div>
  )
}

interface SortsProps {
  activeSorts: SortValue[]
  sortOptions: SortOption[]
  handleUpdateSort: UseFiltersReturn['handleUpdateSort']
  handleSortChange: UseFiltersReturn['handleSortChange']
  handleRemoveSort: UseFiltersReturn['handleRemoveSort']
  handleResetSorts: UseFiltersReturn['handleResetSorts']
  handleReorderSorts: UseFiltersReturn['handleReorderSorts']
  searchQueries: FilterSearchQueries
  handleSearchChange: UseFiltersReturn['handleSearchChange']
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex h-8 items-center gap-x-3 whitespace-nowrap rounded bg-background-3 px-2.5 transition-colors duration-200 hover:bg-background-8">
        <div className="flex items-center gap-x-1">
          <Icon
            className={cn('text-icons-1', getSortTriggerLabel(activeSorts, sortOptions).isDescending && 'rotate-180')}
            name={getSortTriggerLabel(activeSorts, sortOptions).icon}
            size={10}
          />
          <span className="text-13 text-foreground-1">{getSortTriggerLabel(activeSorts, sortOptions).label}</span>
        </div>
        <Icon name="chevron-down" size={10} className="chevron-down" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[310px] px-3 py-2.5" align="start">
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-x-1.5 text-14 text-foreground-4 transition-colors duration-200 hover:text-foreground-1">
                <Icon name="plus" size={12} />
                Add sort
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[224px] p-0" align="start">
                <div className="relative flex items-center justify-between border-b border-borders-4 px-3 py-2.5">
                  <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent" asChild>
                    <Input
                      type="text"
                      placeholder="Sort by..."
                      value={searchQueries.menu.sort || ''}
                      onChange={e => handleSearchChange('sort', e.target.value, 'menu')}
                      onKeyDown={e => e.stopPropagation()}
                      onClick={e => e.preventDefault()}
                    />
                  </DropdownMenuItem>

                  {searchQueries.menu['sort'] && (
                    <DropdownMenuItem className="absolute right-3 hover:bg-transparent focus:bg-transparent" asChild>
                      <button
                        className="flex text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
                        onClick={e => {
                          e.preventDefault()
                          handleSearchChange('sort', '', 'menu')
                        }}
                      >
                        <Icon className="rotate-45" name="plus" size={12} />
                      </button>
                    </DropdownMenuItem>
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
                      <DropdownMenuItem
                        onSelect={() => handleSortChange({ type: option.value, direction: 'desc' })}
                        key={option.value}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}

                  {filteredBySearchSortOptions.length === 0 && (
                    <div className="flex items-center justify-center p-4">
                      <span className="text-1 leading-none text-foreground-2">No results</span>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenuItem
            className="p-0 focus:bg-transparent focus:text-foreground-danger focus:outline-none"
            asChild
          >
            <button
              className="flex items-center gap-x-1.5 text-14 text-foreground-4 transition-colors duration-200 hover:text-foreground-danger"
              onClick={handleResetSorts}
            >
              <Icon name="trash" size={12} />
              Delete sort
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Sorts
