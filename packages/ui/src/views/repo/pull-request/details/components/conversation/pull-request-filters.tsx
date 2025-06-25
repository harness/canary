import { DropdownMenu, IconV2, Text } from '@/components'
import { cn } from '@utils/cn'

interface DropdownMenuComponentProps<T> {
  items: T[]
  selectedItem: T
  onItemSelect: (item: T) => void
}

const DropdownMenuComponent = <T extends { label: string; value: string }>({
  items,
  selectedItem,
  onItemSelect
}: DropdownMenuComponentProps<T>) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5">
        <span className="text-cn-foreground-2 transition-colors duration-200 group-hover:text-cn-foreground-1">
          {selectedItem.label}
        </span>
        <IconV2 name="nav-solid-arrow-down" size="2xs" className="chevron-down text-icons-7" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {items.map(item => (
          <DropdownMenu.Item key={item.value} onClick={() => onItemSelect(item)} title={item.label} />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

interface FilterOption {
  label: string
  value: string
}

export interface PullRequestFilterProps<T extends FilterOption> {
  activityFilters: T[]
  dateFilters: T[]
  activityFilter: T
  dateOrderSort: T
  setActivityFilter: (filter: T) => void
  setDateOrderSort: (sort: T) => void
  className?: string
}

const PullRequestFilters = <T extends FilterOption>({
  activityFilters,
  dateFilters,
  activityFilter,
  dateOrderSort,
  setActivityFilter,
  setDateOrderSort,
  className
}: PullRequestFilterProps<T>) => {
  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center border-b border-cn-borders-2 pb-2', className)}>
      <Text as="h3" variant="heading-subsection" color="foreground-1" className="leading-snug">
        Overview
      </Text>

      <div className="flex items-center gap-x-5">
        <DropdownMenuComponent items={activityFilters} selectedItem={activityFilter} onItemSelect={setActivityFilter} />
        <DropdownMenuComponent items={dateFilters} selectedItem={dateOrderSort} onItemSelect={setDateOrderSort} />
      </div>
    </div>
  )
}

export { PullRequestFilters }
