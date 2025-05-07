// TODO: we should rethink the approach and stop using the @dnd-kit library

import { Button, DropdownMenu, Icon } from '@/components'
import SearchableDropdown from '@components/searchable-dropdown/searchable-dropdown'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useDragAndDrop from '@hooks/use-drag-and-drop'
import { cn } from '@utils/cn'

import { useSort } from './sort-context'
import { Direction, SortDirection, SortOption, SortValue } from './type'

export const getSortTriggerLabel = (sortSelections: SortValue[], sortOptions: SortOption[]) => {
  if (sortSelections.length === 0) return { label: '', icon: 'circle-arrows-updown' as const }

  if (sortSelections.length === 1) {
    const currentSort = sortSelections[0]
    const label = sortOptions.find(opt => opt.value === currentSort.type)?.label

    return {
      label,
      icon: 'circle-arrow-top' as const,
      isDescending: currentSort.direction === Direction.DESC
    }
  }

  return {
    label: `${sortSelections.length} sorts`,
    icon: 'circle-arrows-updown' as const,
    isDescending: false
  }
}

interface SortableItemProps {
  id: string
  sort: SortValue
  index: number
  onUpdateSort: (index: number, sort: SortValue) => void
  onRemoveSort: (index: number) => void
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
    <div className={cn('relative', isDragging && 'z-10', 'flex items-center gap-x-2')} ref={setNodeRef} style={style}>
      <div
        className="cursor-grab rounded p-1 hover:bg-cn-background-3 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Icon className="text-icons-1" name="grid-dots" size={12} />
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" size="sm" className="gap-x-1.5">
            {sortOptions.find(opt => opt.value === sort.type)?.label}
            <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
          </Button>
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
        <DropdownMenu.Trigger asChild>
          <Button variant="outline" size="sm" className="gap-x-1.5">
            {sortDirections.find(dir => dir.value === sort.direction)?.label}
            <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
          </Button>
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

      <Button variant="ghost" size="sm" iconOnly className="ml-auto" onClick={() => onRemoveSort(index)}>
        <Icon className="rotate-45" name="plus" size={12} />
      </Button>
    </div>
  )
}

export default function MultiSort() {
  const { sortSelections, updateSortSelections, sortOptions, sortDirections, sortOpen, setSortOpen } = useSort()
  const { handleDragEnd, getItemId } = useDragAndDrop({
    items: sortSelections,
    onReorder: newSorts => updateSortSelections(newSorts)
  })

  const filteredBySearchSortOptions = sortOptions.filter(
    option => !sortSelections.some(sort => sort.type === option.value)
  )

  // Handler for resetting all sorts
  const handleResetSorts = () => {
    updateSortSelections([])
    setSortOpen(false)
  }

  // Handler for adding a new sort
  const handleSortChange = (sort: SortValue) => {
    updateSortSelections([...sortSelections, sort])
  }

  if (sortSelections.length <= 0) {
    return null
  }

  return (
    <DropdownMenu.Root open={sortOpen} onOpenChange={setSortOpen}>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" className="gap-x-1.5">
          <Icon
            className={cn(
              'text-icons-1',
              getSortTriggerLabel(sortSelections, sortOptions).isDescending && 'rotate-180'
            )}
            name={getSortTriggerLabel(sortSelections, sortOptions).icon}
            size={10}
          />
          <span className="text-cn-foreground-1">{getSortTriggerLabel(sortSelections, sortOptions).label}</span>
          <Icon className="chevron-down text-icons-1 ml-3" name="chevron-down" size={10} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-[310px] px-3 py-2.5" align="start">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext
            items={sortSelections.map((_, index) => getItemId(index))}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-y-2.5">
              {sortSelections.map((sort, index) => {
                const itemOption = sortOptions.find(option => option.value === sort.type)
                if (!itemOption) return null

                return (
                  <SortableItem
                    key={index}
                    id={getItemId(index)}
                    sort={sort}
                    index={index}
                    onUpdateSort={(index, sort) => {
                      const newSorts = [...sortSelections]
                      newSorts[index] = sort
                      updateSortSelections(newSorts)
                    }}
                    onRemoveSort={index => {
                      const newSorts = sortSelections.filter((_, i) => i !== index)
                      updateSortSelections(newSorts)
                    }}
                    sortOptions={[itemOption, ...filteredBySearchSortOptions]}
                    sortDirections={sortDirections}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-3 inline-flex flex-col gap-1">
          {filteredBySearchSortOptions.length > 0 && (
            <SearchableDropdown
              options={filteredBySearchSortOptions}
              dropdownAlign="start"
              inputPlaceholder="Select..."
              onChange={(sortValue: SortOption) =>
                handleSortChange({ type: sortValue.value, direction: Direction.ASC })
              }
              displayLabel={
                <Button size="sm" variant="ghost" className="gap-x-1.5">
                  <Icon name="plus" size={12} />
                  Add sort
                </Button>
              }
            />
          )}
          <Button size="sm" variant="ghost" className="hover:text-cn-foreground-danger" onClick={handleResetSorts}>
            <Icon name="trash" size={12} />
            Delete sort
          </Button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
