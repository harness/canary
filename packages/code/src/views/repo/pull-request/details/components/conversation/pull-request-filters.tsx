import { DropdownMenu, IconV2, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

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
      <DropdownMenu.Trigger className="flex items-center gap-x-cn-2xs">
        <span className="text-cn-2 transition-colors duration-200 group-hover:text-cn-1">{selectedItem.label}</span>
        <IconV2 name="nav-solid-arrow-down" size="2xs" className="chevron-down text-cn-2" />
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
    <div className={cn('grid grid-cols-[1fr_auto] items-center border-b border-cn-2 pb-cn-xs', className)}>
      <Text as="h3" variant="heading-subsection" className="leading-snug">
        Overview
      </Text>

      <div className="flex items-center gap-x-cn-lg">
        <DropdownMenuComponent items={activityFilters} selectedItem={activityFilter} onItemSelect={setActivityFilter} />
        <DropdownMenuComponent items={dateFilters} selectedItem={dateOrderSort} onItemSelect={setDateOrderSort} />
      </div>
    </div>
  )
}

export { PullRequestFilters }
