import { useEffect, useMemo, useState } from 'react'

import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'
import { getTheme, Themes } from '@utils/theme-utils'

import { DataTable, Layout, Select, StatusBadge, Text } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

type Person = {
  name: string
  age: number
  visits: number
  status: 'active' | 'inactive' | 'pending'
  profileProgress: number
  team: string
  location: string
}

const people: Person[] = [
  { name: 'Alice Chen', age: 28, visits: 142, status: 'active', profileProgress: 88, team: 'Platform', location: 'SF' },
  {
    name: 'Bob Martinez',
    age: 35,
    visits: 67,
    status: 'inactive',
    profileProgress: 42,
    team: 'Design',
    location: 'NYC'
  },
  {
    name: 'Priya Patel',
    age: 31,
    visits: 203,
    status: 'active',
    profileProgress: 95,
    team: 'Product',
    location: 'BLR'
  },
  { name: 'Diego Rivera', age: 26, visits: 18, status: 'pending', profileProgress: 25, team: 'Growth', location: 'MX' },
  { name: 'Mei Lin', age: 42, visits: 178, status: 'active', profileProgress: 76, team: 'Platform', location: 'SG' },
  { name: 'Marcus Lee', age: 30, visits: 91, status: 'active', profileProgress: 60, team: 'Support', location: 'LON' }
]

const statusBadge = (value: unknown) => {
  const status = String(value) as Person['status']
  const theme = status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'warning'
  return (
    <StatusBadge variant="secondary" theme={theme} size="sm">
      {status}
    </StatusBadge>
  )
}

const themeOptions = [
  { label: 'Dark', value: Themes.DARK },
  { label: 'Light', value: Themes.LIGHT }
]

const SCROLLABLE_TABLE_WIDTH = 800

const useClientSorting = () => {
  const [sorting, setSorting] = useState<SortingState>([])

  const onSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    setSorting(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))
  }

  const sortedData = useMemo(() => {
    if (sorting.length === 0) return people
    const sort = sorting[0]
    const key = sort.id as keyof Person
    return [...people].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return sort.desc ? 1 : -1
      if (aVal > bVal) return sort.desc ? -1 : 1
      return 0
    })
  }, [sorting])

  return { sorting, onSortingChange, sortedData }
}

const singleFullColumns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true },
  { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    enableResizing: false,
    cell: info => statusBadge(info.getValue())
  },
  {
    id: 'profileProgress',
    accessorKey: 'profileProgress',
    header: 'Profile Progress',
    enableSorting: true
  }
]

const singleScrollColumns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true, size: 220, minSize: 140, maxSize: 360 },
  { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true, size: 120, minSize: 80, maxSize: 200 },
  { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true, size: 160, minSize: 100 },
  { id: 'team', accessorKey: 'team', header: 'Team', enableSorting: true, size: 180, minSize: 120 },
  { id: 'location', accessorKey: 'location', header: 'Location', enableSorting: true, size: 160, minSize: 100 },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    enableResizing: false,
    size: 140,
    cell: info => statusBadge(info.getValue())
  },
  {
    id: 'profileProgress',
    accessorKey: 'profileProgress',
    header: 'Profile Progress',
    enableSorting: true,
    size: 220,
    minSize: 140
  }
]

const groupedFullColumns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  {
    id: 'info',
    header: 'Info',
    enableSorting: false,
    columns: [
      { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true },
      { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        enableResizing: false,
        cell: info => statusBadge(info.getValue())
      },
      {
        id: 'profileProgress',
        accessorKey: 'profileProgress',
        header: 'Profile Progress',
        enableSorting: true
      }
    ]
  }
]

const groupedScrollColumns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true, size: 220, minSize: 140, maxSize: 360 },
  {
    id: 'info',
    header: 'Info',
    enableSorting: false,
    columns: [
      { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true, size: 140, minSize: 80, maxSize: 220 },
      { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true, size: 160, minSize: 100 },
      { id: 'team', accessorKey: 'team', header: 'Team', enableSorting: true, size: 180, minSize: 120 },
      { id: 'location', accessorKey: 'location', header: 'Location', enableSorting: true, size: 160, minSize: 100 },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        enableResizing: false,
        size: 140,
        cell: info => statusBadge(info.getValue())
      },
      {
        id: 'profileProgress',
        accessorKey: 'profileProgress',
        header: 'Profile Progress',
        enableSorting: true,
        size: 220,
        minSize: 140
      }
    ]
  }
]

const DemoTable = ({
  testId,
  columns,
  rowIdSuffix,
  width,
  fullWidth = false
}: {
  testId: string
  columns: ColumnDef<Person>[]
  rowIdSuffix: string
  width?: number
  fullWidth?: boolean
}) => {
  const { sorting, onSortingChange, sortedData } = useClientSorting()

  return (
    <div
      data-testid={testId}
      data-resize-layout={fullWidth ? 'full-width' : undefined}
      style={width ? { width, maxWidth: '100%' } : undefined}
    >
      <DataTable<Person>
        columns={columns}
        data={sortedData}
        getRowId={row => `${row.name}-${rowIdSuffix}`}
        enableColumnResizing
        currentSorting={sorting}
        onSortingChange={onSortingChange}
        className="text-cn-1"
      />
    </div>
  )
}

export const DataTableColumnResizingDemo: React.FC = () => {
  const [theme, setTheme] = useState<Themes>(getTheme)

  useEffect(() => {
    const bodyClass = document.body.classList

    for (const value of Object.values(Themes)) {
      bodyClass.remove(value)
    }

    bodyClass.add(theme)
    sessionStorage.setItem('view-preview-theme', theme)
  }, [theme])

  return (
    <SandboxLayout.Main className="flex items-center justify-center">
      <SandboxLayout.Content className="w-full justify-center">
        <style>
          {`[data-resize-layout='full-width'] .cn-table-v2-overlay-host {
            width: 100% !important;
          }`}
        </style>
        <Layout.Vertical gap="2xl" className="w-full">
          <Layout.Horizontal align="center" justify="between" className="w-full">
            <Text variant="heading-subsection">Column resizing</Text>
            <div className="w-[180px]" data-testid="column-resizing-theme">
              <Select<Themes>
                options={themeOptions}
                label="Theme"
                optional
                placeholder="Select theme"
                value={theme === Themes.LIGHT ? Themes.LIGHT : Themes.DARK}
                onChange={setTheme}
              />
            </div>
          </Layout.Horizontal>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Single header, full width</Text>
            <Text variant="body-normal" color="foreground-3">
              No column sizes are set, so the table fills the container like the grouped-headers demo. Resizing a middle
              column lets sibling columns share the remaining space.
            </Text>
            <DemoTable
              testId="column-resizing-single-full"
              columns={singleFullColumns}
              rowIdSuffix="single-full"
              fullWidth
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Single header, horizontal scroll</Text>
            <Text variant="body-normal" color="foreground-3">
              Wide leaf columns in a constrained container. Scroll horizontally, then drag a handle.
            </Text>
            <DemoTable
              testId="column-resizing-scroll"
              columns={singleScrollColumns}
              rowIdSuffix="scroll"
              width={SCROLLABLE_TABLE_WIDTH}
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Grouped headers, full width</Text>
            <Text variant="body-normal" color="foreground-3">
              Same as the grouped-headers demo: no column sizes, so the table fills the container. Only leaf columns
              expose handles; the group header itself is not draggable.
            </Text>
            <DemoTable testId="column-resizing-grouped" columns={groupedFullColumns} rowIdSuffix="grouped" fullWidth />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Grouped headers, horizontal scroll</Text>
            <Text variant="body-normal" color="foreground-3">
              Grouped leaf columns in a constrained container. The drag line stays on the leaf header, not the parent
              group.
            </Text>
            <DemoTable
              testId="column-resizing-grouped-scroll"
              columns={groupedScrollColumns}
              rowIdSuffix="grouped-scroll"
              width={SCROLLABLE_TABLE_WIDTH}
            />
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableColumnResizingDemo
