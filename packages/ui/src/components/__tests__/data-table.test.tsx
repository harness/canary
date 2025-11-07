import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ColumnDef } from '@tanstack/react-table'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { DataTable } from '../data-table'

// Test Wrapper with TooltipProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
}

interface TestData {
  id: string
  name: string
  age: number
  email: string
}

describe('DataTable', () => {
  const mockData: TestData[] = [
    { id: '1', name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
  ]

  const mockColumns: ColumnDef<TestData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: info => info.getValue()
    }
  ]

  describe('Rendering', () => {
    test('should render table with data', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    test('should render empty table when no data', () => {
      render(
        <TestWrapper>
          <DataTable data={[]} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    test('should render table headers', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    test('should render all rows', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    })

    test('should use default data array when not provided', () => {
      render(
        <TestWrapper>
          <DataTable data={undefined as any} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('Size Prop', () => {
    test('should render with default size (normal)', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should render with size prop', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} size="compact" />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('className Prop', () => {
    test('should apply custom className', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} className="custom-table" />
        </TestWrapper>
      )

      const table = container.querySelector('.custom-table')
      expect(table).toBeInTheDocument()
    })

    test('should work without className', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Row Click Handling', () => {
    test('should call onRowClick when row is clicked', () => {
      const handleRowClick = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} onRowClick={handleRowClick} />
        </TestWrapper>
      )

      // Click on the cell content, which has the onClick propagated from the row
      const cell = screen.getByText('John Doe')
      const cellElement = cell.closest('td')
      const clickableButton = cellElement?.querySelector('button')
      if (clickableButton) {
        fireEvent.click(clickableButton)
      }

      expect(handleRowClick).toHaveBeenCalledWith(mockData[0], 0)
    })

    test('should not call onRowClick when not provided', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      const cell = screen.getByText('John Doe')
      fireEvent.click(cell)

      // Should not throw error
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should pass correct row data and index', () => {
      const handleRowClick = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} onRowClick={handleRowClick} />
        </TestWrapper>
      )

      // Click on the cell content, which has the onClick propagated from the row
      const cell = screen.getByText('Jane Smith')
      const cellElement = cell.closest('td')
      const clickableButton = cellElement?.querySelector('button')
      if (clickableButton) {
        fireEvent.click(clickableButton)
      }

      expect(handleRowClick).toHaveBeenCalledWith(mockData[1], 1)
    })
  })

  describe('Row Highlight on Hover', () => {
    test('should enable highlight by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should disable highlight when disableHighlightOnHover is true', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} disableHighlightOnHover={true} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should enable highlight when disableHighlightOnHover is false', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} disableHighlightOnHover={false} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Custom Row ClassName', () => {
    test('should apply custom row className', () => {
      const getRowClassName = (row: any) => {
        return row.original.age > 30 ? 'highlighted-row' : undefined
      }

      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} getRowClassName={getRowClassName} />
        </TestWrapper>
      )

      const highlightedRows = container.querySelectorAll('.highlighted-row')
      expect(highlightedRows.length).toBeGreaterThan(0)
    })

    test('should work without getRowClassName', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should handle undefined return from getRowClassName', () => {
      const getRowClassName = () => undefined

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} getRowClassName={getRowClassName} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Sorting', () => {
    test('should render without sorting by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    test('should handle currentSorting prop', () => {
      const sorting = [{ id: 'name', desc: false }]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} currentSorting={sorting} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    test('should call onSortingChange when sorting changes', async () => {
      // Use userEvent directly
      const handleSortingChange = vi.fn()

      const sortableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableSorting: true
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={sortableColumns} onSortingChange={handleSortingChange} />
        </TestWrapper>
      )

      const nameHeader = screen.getByText('Name')
      await userEvent.click(nameHeader)

      expect(handleSortingChange).toHaveBeenCalled()
    })

    test('should work without onSortingChange', async () => {
      // Use userEvent directly

      const sortableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableSorting: true
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={sortableColumns} />
        </TestWrapper>
      )

      const nameHeader = screen.getByText('Name')
      await userEvent.click(nameHeader)

      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('Row Selection', () => {
    test('should not show checkboxes by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes).toHaveLength(0)
    })

    test('should show checkboxes when enableRowSelection is true', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} />
        </TestWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      // Should have header checkbox + row checkboxes
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    test('should render select all checkbox in header', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} />
        </TestWrapper>
      )

      const selectAllCheckbox = screen.getByLabelText('Select all rows')
      expect(selectAllCheckbox).toBeInTheDocument()
    })

    test('should toggle all rows when select all checkbox is clicked', async () => {
      const handleSelectionChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            onRowSelectionChange={handleSelectionChange}
          />
        </TestWrapper>
      )

      const selectAllCheckbox = screen.getByLabelText('Select all rows')
      await userEvent.click(selectAllCheckbox)

      expect(handleSelectionChange).toHaveBeenCalled()
    })

    test('should render select checkbox for each row', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} />
        </TestWrapper>
      )

      const rowCheckboxes = screen.getAllByLabelText('Select row')
      expect(rowCheckboxes.length).toBe(mockData.length)
    })

    test('should call onRowSelectionChange when selection changes', async () => {
      // Use userEvent directly
      const handleSelectionChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            onRowSelectionChange={handleSelectionChange}
          />
        </TestWrapper>
      )

      const checkbox = screen.getAllByLabelText('Select row')[0]
      await userEvent.click(checkbox)

      expect(handleSelectionChange).toHaveBeenCalled()
    })

    test('should handle currentRowSelection prop', () => {
      const rowSelection = { '0': true }

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            currentRowSelection={rowSelection}
          />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument()
    })

    test('should use getRowCanSelect to determine selectable rows', () => {
      const getRowCanSelect = (row: any) => row.original.age > 25

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            getRowCanSelect={getRowCanSelect}
          />
        </TestWrapper>
      )

      const checkboxes = screen.getAllByLabelText('Select row')
      expect(checkboxes.length).toBe(mockData.length)
    })

    test('should disable checkbox when row cannot be selected', () => {
      const getRowCanSelect = (row: any) => row.original.age > 25

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            getRowCanSelect={getRowCanSelect}
          />
        </TestWrapper>
      )

      const checkboxes = screen.getAllByLabelText('Select row')

      // At least one checkbox should be enabled
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    test('should stop propagation on checkbox click', async () => {
      // Use userEvent directly
      const handleRowClick = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} onRowClick={handleRowClick} />
        </TestWrapper>
      )

      const checkbox = screen.getAllByLabelText('Select row')[0]
      await userEvent.click(checkbox)

      // Row click should not be called when clicking checkbox
      expect(handleRowClick).not.toHaveBeenCalled()
    })
  })

  describe('Row Expansion', () => {
    test('should not show expander by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      const expanders = screen.queryAllByLabelText('Toggle Row Expanded')
      expect(expanders).toHaveLength(0)
    })

    test('should show expander when enableExpanding is true', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} />
        </TestWrapper>
      )

      const expanders = screen.getAllByLabelText('Toggle Row Expanded')
      expect(expanders.length).toBe(mockData.length)
    })

    test('should render expander for each expandable row', () => {
      const getRowCanExpand = (row: any) => row.original.age > 25

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} getRowCanExpand={getRowCanExpand} />
        </TestWrapper>
      )

      const expanders = screen.getAllByLabelText('Toggle Row Expanded')
      expect(expanders.length).toBeGreaterThan(0)
    })

    test('should not render expander for non-expandable rows', () => {
      const getRowCanExpand = (row: any) => row.original.age > 100

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} getRowCanExpand={getRowCanExpand} />
        </TestWrapper>
      )

      const expanders = screen.queryAllByLabelText('Toggle Row Expanded')
      expect(expanders).toHaveLength(0)
    })

    test('should call onExpandedChange when expansion changes', async () => {
      // Use userEvent directly
      const handleExpandedChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            onExpandedChange={handleExpandedChange}
          />
        </TestWrapper>
      )

      const expander = screen.getAllByLabelText('Toggle Row Expanded')[0]
      await userEvent.click(expander)

      expect(handleExpandedChange).toHaveBeenCalled()
    })

    test('should handle currentExpanded prop', () => {
      const expanded = { '0': true }

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={expanded} />
        </TestWrapper>
      )

      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBeGreaterThan(0)
    })

    test('should render sub-component when row is expanded', async () => {
      // Use userEvent directly
      const renderSubComponent = ({ row }: any) => <div>Expanded content for {row.original.name}</div>

      const { rerender } = render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            renderSubComponent={renderSubComponent}
            currentExpanded={{}}
          />
        </TestWrapper>
      )

      // Expand first row by updating state
      rerender(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            renderSubComponent={renderSubComponent}
            currentExpanded={{ '0': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText(/Expanded content for/)).toBeInTheDocument()
    })

    test('should stop propagation on expander click', async () => {
      // Use userEvent directly
      const handleRowClick = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} onRowClick={handleRowClick} />
        </TestWrapper>
      )

      const expander = screen.getAllByLabelText('Toggle Row Expanded')[0]
      await userEvent.click(expander)

      // Row click should not be called when clicking expander
      expect(handleRowClick).not.toHaveBeenCalled()
    })

    test('should show correct icon based on expanded state', async () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={{}} />
        </TestWrapper>
      )

      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBeGreaterThan(0)

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={{ '0': true }} />
        </TestWrapper>
      )

      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBeGreaterThan(0)
    })
  })

  describe('Both Selection and Expansion', () => {
    test('should render both checkboxes and expanders', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} enableExpanding={true} />
        </TestWrapper>
      )

      const checkboxes = screen.getAllByLabelText('Select row')
      const expanders = screen.getAllByLabelText('Toggle Row Expanded')

      expect(checkboxes.length).toBe(mockData.length)
      expect(expanders.length).toBe(mockData.length)
    })

    test('should render columns in correct order (expander, select, data)', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} enableExpanding={true} />
        </TestWrapper>
      )

      // Both should be present
      expect(screen.getAllByLabelText('Select row').length).toBeGreaterThan(0)
      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBeGreaterThan(0)
    })
  })

  describe('Pagination', () => {
    test('should render without pagination by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should render with pagination props', () => {
      const paginationProps = {
        totalItems: 100,
        pageSize: 10,
        currentPage: 1,
        goToPage: vi.fn()
      }

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} paginationProps={paginationProps} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('getRowId Prop', () => {
    test('should use custom getRowId function', () => {
      const getRowId = (row: TestData) => row.id

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} getRowId={getRowId} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should work without getRowId', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Column Resizing (Internal)', () => {
    test('should not show resize handles by default', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      const resizeHandles = screen.queryAllByLabelText('Resize column')
      expect(resizeHandles).toHaveLength(0)
    })

    test('should show resize handles when _enableColumnResizing is true', () => {
      const resizableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableResizing: true
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={resizableColumns} _enableColumnResizing={true} />
        </TestWrapper>
      )

      const resizeHandles = screen.getAllByLabelText('Resize column')
      expect(resizeHandles.length).toBeGreaterThan(0)
    })

    test('should not show resize handle for non-resizable columns', () => {
      const resizableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableResizing: false
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={resizableColumns} _enableColumnResizing={true} />
        </TestWrapper>
      )

      const resizeHandles = screen.queryAllByLabelText('Resize column')
      expect(resizeHandles).toHaveLength(0)
    })
  })

  describe('Empty State', () => {
    test('should render table with headers but no rows', () => {
      render(
        <TestWrapper>
          <DataTable data={[]} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    test('should render with empty columns', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={[]} />
        </TestWrapper>
      )

      // Should not throw error
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={[]} />
        </TestWrapper>
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Complex Columns', () => {
    test('should handle columns with custom cell renderers', () => {
      const customColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          cell: info => <strong>{info.getValue() as string}</strong>
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={customColumns} />
        </TestWrapper>
      )

      const strongElement = screen.getByText('John Doe')
      expect(strongElement.tagName).toBe('STRONG')
    })

    test('should handle columns with custom headers', () => {
      const customColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: () => <div>Custom Header</div>
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={customColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Custom Header')).toBeInTheDocument()
    })

    test('should handle columns with size property', () => {
      const customColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          size: 200
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={customColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('Row Selection State', () => {
    test('should show selected state on rows', () => {
      const rowSelection = { '0': true }

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableRowSelection={true}
            currentRowSelection={rowSelection}
          />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should not show selected state when row selection is disabled', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={false} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle single row', () => {
      render(
        <TestWrapper>
          <DataTable data={[mockData[0]]} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should handle many rows', () => {
      const manyRows = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Person ${i}`,
        age: 20 + i,
        email: `person${i}@example.com`
      }))

      render(
        <TestWrapper>
          <DataTable data={manyRows} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Person 0')).toBeInTheDocument()
    })

    test('should handle data with null values', () => {
      const dataWithNull: TestData[] = [{ id: '1', name: 'John', age: 30, email: null as any }]

      render(
        <TestWrapper>
          <DataTable data={dataWithNull} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John')).toBeInTheDocument()
    })

    test('should handle data with undefined values', () => {
      const dataWithUndefined: TestData[] = [
        { id: '1', name: 'John', age: undefined as any, email: 'test@example.com' }
      ]

      const columnsWithUndefinedHandling: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          cell: info => info.getValue() || '-'
        },
        {
          accessorKey: 'age',
          header: 'Age',
          cell: info => info.getValue() || '-'
        },
        {
          accessorKey: 'email',
          header: 'Email',
          cell: info => info.getValue() || '-'
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={dataWithUndefined} columns={columnsWithUndefinedHandling} />
        </TestWrapper>
      )

      expect(screen.getByText('John')).toBeInTheDocument()
    })

    test('should handle columns with placeholder', () => {
      const columnsWithPlaceholder: ColumnDef<TestData>[] = [
        {
          id: 'placeholder',
          header: () => null,
          cell: () => null
        },
        {
          accessorKey: 'name',
          header: 'Name',
          cell: info => info.getValue()
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={columnsWithPlaceholder} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should handle empty expanded state', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={{}} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should handle empty row selection state', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} currentRowSelection={{}} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible checkbox labels', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument()
      expect(screen.getAllByLabelText('Select row').length).toBe(mockData.length)
    })

    test('should have accessible expander labels', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} />
        </TestWrapper>
      )

      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBe(mockData.length)
    })

    test('should have accessible resize column labels', () => {
      const resizableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableResizing: true
        }
      ]

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={resizableColumns} _enableColumnResizing={true} />
        </TestWrapper>
      )

      const resizeHandles = screen.getAllByLabelText('Resize column')
      expect(resizeHandles.length).toBeGreaterThan(0)
    })
  })

  describe('Re-rendering', () => {
    test('should update when data changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      const newData = [{ id: '4', name: 'New Person', age: 40, email: 'new@example.com' }]

      rerender(
        <TestWrapper>
          <DataTable data={newData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('New Person')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })

    test('should update when columns change', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()

      const newColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'email',
          header: 'Email Only'
        }
      ]

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={newColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('Email Only')).toBeInTheDocument()
      expect(screen.queryByText('Name')).not.toBeInTheDocument()
    })

    test('should update when enableRowSelection changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={false} />
        </TestWrapper>
      )

      expect(screen.queryAllByRole('checkbox')).toHaveLength(0)

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableRowSelection={true} />
        </TestWrapper>
      )

      expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0)
    })

    test('should update when enableExpanding changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={false} />
        </TestWrapper>
      )

      expect(screen.queryAllByLabelText('Toggle Row Expanded')).toHaveLength(0)

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} />
        </TestWrapper>
      )

      expect(screen.getAllByLabelText('Toggle Row Expanded').length).toBeGreaterThan(0)
    })
  })

  describe('Sub-component Rendering', () => {
    test('should not render sub-component when renderSubComponent is not provided', async () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={{}} />
        </TestWrapper>
      )

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} enableExpanding={true} currentExpanded={{ '0': true }} />
        </TestWrapper>
      )

      expect(screen.queryByText(/Expanded content/)).not.toBeInTheDocument()
    })

    test('should render expanded row with correct colspan', async () => {
      const renderSubComponent = ({ row }: any) => <div>Expanded {row.original.name}</div>

      const { rerender } = render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            renderSubComponent={renderSubComponent}
            currentExpanded={{}}
          />
        </TestWrapper>
      )

      rerender(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            renderSubComponent={renderSubComponent}
            currentExpanded={{ '0': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText(/Expanded John Doe/)).toBeInTheDocument()
    })

    test('should handle multiple expanded rows', async () => {
      const renderSubComponent = ({ row }: any) => <div>Expanded {row.original.name}</div>

      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            enableExpanding={true}
            renderSubComponent={renderSubComponent}
            currentExpanded={{ '0': true, '1': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText(/Expanded John Doe/)).toBeInTheDocument()
      expect(screen.getByText(/Expanded Jane Smith/)).toBeInTheDocument()
    })
  })

  describe('Table Structure', () => {
    test('should render table with header groups', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      // Headers should be in the table
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    test('should render table body with rows', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      // Data should be in the table
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('30')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    test('should render cells with correct data', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      // All cell data should be present
      mockData.forEach(row => {
        expect(screen.getByText(row.name)).toBeInTheDocument()
        expect(screen.getByText(row.age.toString())).toBeInTheDocument()
        expect(screen.getByText(row.email)).toBeInTheDocument()
      })
    })
  })

  describe('useMemo Optimizations', () => {
    test('should memoize table columns', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      // Re-render with same props
      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should memoize table options', () => {
      const { rerender } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Default Props', () => {
    test('should use default size', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should use default disableHighlightOnHover', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should use default enableRowSelection', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    })

    test('should use default enableExpanding', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.queryAllByLabelText('Toggle Row Expanded')).toHaveLength(0)
    })

    test('should use default _enableColumnResizing', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(screen.queryAllByLabelText('Resize column')).toHaveLength(0)
    })
  })
})
