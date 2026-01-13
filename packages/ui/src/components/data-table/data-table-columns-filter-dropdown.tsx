import { FC } from 'react'

import { Button, CheckboxOptions, DropdownMenu, IconV2, Text } from '@/components'

export interface DataTableColumnFilterDropdownProps {
  columns: CheckboxOptions[]
  visibleColumns: string[]
  onCheckedChange: (columnName: string, checked: boolean) => void
  onReset?: () => void
}

export const DataTableColumnFilterDropdown: FC<DataTableColumnFilterDropdownProps> = ({
  columns,
  visibleColumns,
  onCheckedChange,
  onReset
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          Columns
          <Text color="foreground-4">
            {visibleColumns?.length || 0}/{columns?.length || 0}
          </Text>
          <IconV2 name="nav-arrow-down" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {columns.map(column => (
          <DropdownMenu.CheckboxItem
            key={column.value}
            title={column.label}
            checked={visibleColumns.includes(column.value)}
            onCheckedChange={checked => onCheckedChange(column.value, checked)}
          />
        ))}
        {onReset && (
          <DropdownMenu.Footer>
            <Button size="xs" variant="transparent" onClick={onReset}>
              <IconV2 size="xs" name="refresh" />
              Reset
            </Button>
          </DropdownMenu.Footer>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

DataTableColumnFilterDropdown.displayName = 'DataTableColumnFilterDropdown'
