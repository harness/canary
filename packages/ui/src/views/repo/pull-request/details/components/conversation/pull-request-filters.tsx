import { DropdownMenu, Icon } from '@/components'

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
        <span className="text-foreground-2 transition-colors duration-200 group-hover:text-foreground-1">
          {selectedItem.label}
        </span>
        <Icon name="chevron-fill-down" size={6} className="chevron-down text-icons-7" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="end">
        {items.map(item => (
          <DropdownMenu.Item className="py-2.5" key={item.value} onClick={() => onItemSelect(item)}>
            {item.label}
          </DropdownMenu.Item>
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
}

const PullRequestFilters = <T extends FilterOption>({
  activityFilters,
  dateFilters,
  activityFilter,
  dateOrderSort,
  setActivityFilter,
  setDateOrderSort
}: PullRequestFilterProps<T>) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center border-b border-borders-1 pb-2">
      <h3 className="text-18 font-medium leading-snug text-foreground-1">Overview</h3>
      <div className="flex items-center gap-x-5">
        <DropdownMenuComponent items={activityFilters} selectedItem={activityFilter} onItemSelect={setActivityFilter} />
        <DropdownMenuComponent items={dateFilters} selectedItem={dateOrderSort} onItemSelect={setDateOrderSort} />
      </div>
    </div>
  )
}

export { PullRequestFilters }
