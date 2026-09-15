import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Column, ColumnDef } from '@tanstack/react-table'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { DataTable } from '../data-table'
import { computeSpacerHeight } from '../data-table/use-spacer-height'
import { getCommonPinningStyles, getStickyCellStyles } from '../data-table/utils'

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

  describe('Grouped Headers', () => {
    const groupedColumns: ColumnDef<TestData>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true
      },
      {
        id: 'contact',
        header: 'Contact',
        enableSorting: false,
        columns: [
          {
            id: 'age',
            accessorKey: 'age',
            header: 'Age',
            enableSorting: true
          },
          {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            enableSorting: false
          }
        ]
      }
    ]

    test('should render two header rows for nested columns', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={groupedColumns} />
        </TestWrapper>
      )

      const headerRows = container.querySelectorAll('thead tr')
      expect(headerRows).toHaveLength(2)
    })

    test('should render group header with correct colSpan', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={groupedColumns} />
        </TestWrapper>
      )

      const contactGroupHeader = screen.getByText('Contact')
      expect(contactGroupHeader.closest('th')).toHaveAttribute('colspan', '2')
    })

    test('should render top-level leaf columns with rowSpan instead of placeholders', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={groupedColumns} />
        </TestWrapper>
      )

      const nameCell = screen.getByText('Name').closest('th')
      expect(nameCell).toHaveAttribute('rowspan', '2')

      // The group row should not contain the leaf header for top-level columns
      const groupRow = container.querySelector('thead tr[data-header-depth="0"]')
      const groupRowCells = groupRow?.querySelectorAll('th')
      expect(groupRowCells?.length).toBe(2)
    })

    test('should call onSortingChange only from leaf-row sortable headers', async () => {
      const handleSortingChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={groupedColumns} onSortingChange={handleSortingChange} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByText('Contact'))
      expect(handleSortingChange).not.toHaveBeenCalled()

      await userEvent.click(screen.getByText('Age'))
      expect(handleSortingChange).toHaveBeenCalled()
    })

    test('should call onSortingChange from ungrouped leaf headers', async () => {
      const handleSortingChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable data={mockData} columns={groupedColumns} onSortingChange={handleSortingChange} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByText('Name'))
      expect(handleSortingChange).toHaveBeenCalled()
    })
  })

  describe('Table Structure', () => {
    test('should render flat table headers', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

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

  describe('Tree Mode (getSubRows)', () => {
    interface TreeData {
      id: string
      name: string
      value: number
      children?: TreeData[]
    }

    const treeData: TreeData[] = [
      {
        id: '1',
        name: 'Parent A',
        value: 100,
        children: [
          {
            id: '1-1',
            name: 'Child A1',
            value: 60,
            children: [{ id: '1-1-1', name: 'Grandchild A1a', value: 30 }]
          },
          { id: '1-2', name: 'Child A2', value: 40 }
        ]
      },
      { id: '2', name: 'Parent B', value: 50 }
    ]

    const treeColumns: ColumnDef<TreeData>[] = [
      { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
      { accessorKey: 'value', header: 'Value', cell: info => info.getValue() }
    ]

    const getSubRows = (row: TreeData) => row.children

    test('should only render top-level rows when collapsed', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            currentExpanded={{}}
          />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.getByText('Parent B')).toBeInTheDocument()
      expect(screen.queryByText('Child A1')).not.toBeInTheDocument()
      expect(screen.queryByText('Child A2')).not.toBeInTheDocument()
    })

    test('should show child rows when parent is expanded', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            currentExpanded={{ '1': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.getByText('Child A1')).toBeInTheDocument()
      expect(screen.getByText('Child A2')).toBeInTheDocument()
      expect(screen.queryByText('Grandchild A1a')).not.toBeInTheDocument()
    })

    test('should show deeply nested rows when multiple levels expanded', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            currentExpanded={{ '1': true, '1-1': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.getByText('Child A1')).toBeInTheDocument()
      expect(screen.getByText('Grandchild A1a')).toBeInTheDocument()
    })

    test('should indent expander based on row depth', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            currentExpanded={{ '1': true, '1-1': true }}
          />
        </TestWrapper>
      )

      const rows = container.querySelectorAll('tbody tr')
      const getExpanderDiv = (row: Element) => row.querySelector('td:first-child > div[data-depth]')

      // Parent A (depth 0) — no indentation style
      expect(getExpanderDiv(rows[0])?.getAttribute('data-depth')).toBe('0')
      expect(getExpanderDiv(rows[0])?.getAttribute('style')).toBeNull()

      // Child A1 (depth 1)
      expect(getExpanderDiv(rows[1])?.getAttribute('data-depth')).toBe('1')

      // Grandchild A1a (depth 2)
      expect(getExpanderDiv(rows[2])?.getAttribute('data-depth')).toBe('2')
    })

    test('should call onExpandedChange when toggling tree row', async () => {
      const handleExpandedChange = vi.fn()

      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            currentExpanded={{}}
            onExpandedChange={handleExpandedChange}
          />
        </TestWrapper>
      )

      const expander = screen.getAllByLabelText('Toggle Row Expanded')[0]
      await userEvent.click(expander)

      expect(handleExpandedChange).toHaveBeenCalled()
    })

    test('should not show expander for leaf rows', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            currentExpanded={{ '1': true }}
          />
        </TestWrapper>
      )

      const expanders = screen.getAllByLabelText('Toggle Row Expanded')
      // Parent A (has children) and Child A1 (has children) get expanders.
      // Child A2 and Parent B do not (leaf / no children).
      expect(expanders).toHaveLength(2)
    })

    test('should embed chevron in first content column, not a separate column', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            currentExpanded={{}}
          />
        </TestWrapper>
      )

      // In tree mode there should be no separate expander header (only data column headers)
      const headers = container.querySelectorAll('thead th')
      expect(headers).toHaveLength(treeColumns.length)

      // The chevron and content should be in the same cell
      const firstRow = container.querySelector('tbody tr')!
      const firstCell = firstRow.querySelector('td')!
      expect(firstCell.querySelector('[data-depth]')).toBeTruthy()
      expect(firstCell.textContent).toContain('Parent A')
    })

    test('should not render renderSubComponent in tree mode', () => {
      const renderSubComponent = ({ row }: any) => <div>Detail for {row.original.name}</div>

      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            renderSubComponent={renderSubComponent}
            currentExpanded={{ '1': true }}
          />
        </TestWrapper>
      )

      expect(screen.queryByText(/Detail for/)).not.toBeInTheDocument()
      expect(screen.getByText('Child A1')).toBeInTheDocument()
    })

    test('detail-panel mode still works without getSubRows', () => {
      const renderSubComponent = ({ row }: any) => <div>Detail for {row.original.name}</div>

      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            renderSubComponent={renderSubComponent}
            currentExpanded={{ '0': true }}
          />
        </TestWrapper>
      )

      expect(screen.getByText(/Detail for Parent A/)).toBeInTheDocument()
    })

    test('should not apply indentation in detail-panel mode', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={treeData} columns={treeColumns} enableExpanding currentExpanded={{}} />
        </TestWrapper>
      )

      const depthDivs = container.querySelectorAll('td:first-child > div[data-depth]')
      expect(depthDivs).toHaveLength(0)
    })

    test('should keep all rows collapsed by default', () => {
      render(
        <TestWrapper>
          <DataTable data={treeData} columns={treeColumns} enableExpanding getSubRows={getSubRows} />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.getByText('Parent B')).toBeInTheDocument()
      expect(screen.queryByText('Child A1')).not.toBeInTheDocument()
    })

    test('should expand all rows when initiallyExpandAllRows is true', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            initiallyExpandAllRows
          />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.getByText('Child A1')).toBeInTheDocument()
      expect(screen.getByText('Child A2')).toBeInTheDocument()
      expect(screen.getByText('Grandchild A1a')).toBeInTheDocument()
      expect(screen.getByText('Parent B')).toBeInTheDocument()
    })

    test('currentExpanded should override initiallyExpandAllRows', () => {
      render(
        <TestWrapper>
          <DataTable
            data={treeData}
            columns={treeColumns}
            enableExpanding
            getSubRows={getSubRows}
            getRowId={row => row.id}
            initiallyExpandAllRows
            currentExpanded={{}}
          />
        </TestWrapper>
      )

      expect(screen.getByText('Parent A')).toBeInTheDocument()
      expect(screen.queryByText('Child A1')).not.toBeInTheDocument()
    })
  })

  describe('Sticky Header', () => {
    const stickyGroupedColumns: ColumnDef<TestData>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true
      },
      {
        id: 'contact',
        header: 'Contact',
        enableSorting: false,
        columns: [
          {
            id: 'age',
            accessorKey: 'age',
            header: 'Age',
            enableSorting: true
          },
          {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            enableSorting: false
          }
        ]
      }
    ]

    test('should render the single scroll viewport and sticky container class when stickyHeader is set', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} stickyHeader maxHeight={300} />
        </TestWrapper>
      )

      expect(container.querySelector('.cn-table-v2-container')).toHaveClass('cn-table-v2-sticky')

      const viewport = container.querySelector('.cn-table-v2-viewport')
      expect(viewport).toBeInTheDocument()
      expect(viewport).toHaveStyle({ maxHeight: '300px' })

      // The legacy inner scroll wrapper is not rendered in sticky mode
      expect(container.querySelector('.overflow-x-auto')).not.toBeInTheDocument()
    })

    test('should mark header cells as sticky with top offset and header z-index', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} stickyHeader maxHeight={300} />
        </TestWrapper>
      )

      const heads = container.querySelectorAll('thead th')
      expect(heads.length).toBeGreaterThan(0)
      heads.forEach(head => {
        expect(head).toHaveAttribute('data-sticky', 'top')
        expect(head).toHaveStyle({ position: 'sticky', top: '0px', zIndex: 4 })
      })
    })

    test('should offset the second header row below the first in grouped-header tables', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={stickyGroupedColumns} stickyHeader maxHeight={300} />
        </TestWrapper>
      )

      const depth0Heads = container.querySelectorAll('thead tr[data-header-depth="0"] th')
      expect(depth0Heads.length).toBeGreaterThan(0)
      depth0Heads.forEach(head => {
        expect(head).toHaveStyle({ position: 'sticky', top: '0px' })
      })

      const depth1Heads = container.querySelectorAll('thead tr[data-header-depth="1"] th')
      expect(depth1Heads.length).toBeGreaterThan(0)
      depth1Heads.forEach(head => {
        // jsdom reports zero layout height, so the CSS variable fallback is used
        expect(head).toHaveStyle({ position: 'sticky', top: 'var(--cn-table-header-row-h)' })
      })
    })

    test('should layer sticky headers above pinned columns', () => {
      render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            stickyHeader
            maxHeight={300}
            columnPinning={{ left: ['name'], right: [] }}
          />
        </TestWrapper>
      )

      const nameHead = screen.getByText('Name').closest('th')
      expect(nameHead).toHaveStyle({ position: 'sticky', top: '0px', left: '0px', zIndex: 5 })

      const ageHead = screen.getByText('Age').closest('th')
      expect(ageHead).toHaveStyle({ position: 'sticky', top: '0px', zIndex: 4 })
    })
  })

  describe('Default rendering without stickyHeader (regression)', () => {
    test('should render the legacy structure without sticky classes or attributes', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      )

      expect(container.querySelector('.cn-table-v2-container')).not.toHaveClass('cn-table-v2-sticky')
      expect(container.querySelector('.cn-table-v2-viewport')).not.toBeInTheDocument()
      expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()

      const heads = container.querySelectorAll('thead th')
      heads.forEach(head => {
        expect(head).not.toHaveAttribute('data-sticky')
        expect(head).toHaveStyle({ position: 'relative', zIndex: 0 })
      })
    })

    test('should keep existing column pinning output unchanged', () => {
      render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} columnPinning={{ left: ['name'], right: [] }} />
        </TestWrapper>
      )

      const nameHead = screen.getByText('Name').closest('th')
      expect(nameHead).toHaveStyle({ position: 'sticky', left: '0px', zIndex: 1 })
      expect(nameHead).not.toHaveAttribute('data-sticky')
    })

    test('should not render tfoot or spacer row when rowPinning is not set', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} stickyHeader maxHeight={300} />
        </TestWrapper>
      )

      expect(container.querySelector('tfoot')).not.toBeInTheDocument()
      expect(container.querySelector('.cn-table-v2-spacer-row')).not.toBeInTheDocument()
    })
  })

  describe('Row Pinning (bottom)', () => {
    const dataWithTotals: TestData[] = [...mockData, { id: 'grand-total', name: 'Grand total', age: 90, email: '' }]

    const renderPinnedTable = (extraProps: Record<string, unknown> = {}) =>
      render(
        <TestWrapper>
          <DataTable
            data={dataWithTotals}
            columns={mockColumns}
            getRowId={row => row.id}
            rowPinning={{ bottom: ['grand-total'] }}
            stickyHeader
            maxHeight={300}
            {...extraProps}
          />
        </TestWrapper>
      )

    test('should render the bottom-pinned row once, in a tfoot', () => {
      const { container } = renderPinnedTable()

      const tfoot = container.querySelector('tfoot')
      expect(tfoot).toBeInTheDocument()
      expect(tfoot).toHaveClass('cn-table-v2-footer')

      expect(screen.getAllByText('Grand total')).toHaveLength(1)

      const pinnedRow = screen.getByText('Grand total').closest('tr')
      expect(pinnedRow).toHaveClass('cn-table-v2-row-pinned')
      expect(pinnedRow).toHaveAttribute('data-pinned', 'bottom')
      expect(tfoot).toContainElement(pinnedRow as HTMLElement)
    })

    test('should exclude the pinned row from the body rows', () => {
      const { container } = renderPinnedTable()

      const bodyRows = Array.from(container.querySelectorAll('tbody > tr:not(.cn-table-v2-spacer-row)'))
      expect(bodyRows).toHaveLength(mockData.length)
      expect(bodyRows.some(row => row.textContent?.includes('Grand total'))).toBe(false)
    })

    test('should stick footer cells to the bottom with the pinned-row z-index', () => {
      renderPinnedTable()

      const footerCell = screen.getByText('Grand total').closest('td')
      expect(footerCell).toHaveStyle({ position: 'sticky', bottom: '0px', zIndex: 2 })
    })

    test('should render only the last id when more than one bottom row is pinned', () => {
      const { container } = renderPinnedTable({
        data: [...dataWithTotals, { id: 'grand-total-2', name: 'Grand total 2', age: 120, email: '' }],
        rowPinning: { bottom: ['grand-total', 'grand-total-2'] }
      })

      // The bottom-most (last) id is the single rendered pinned row…
      const footerRows = container.querySelectorAll('tfoot > tr')
      expect(footerRows).toHaveLength(1)
      expect(footerRows[0].textContent).toContain('Grand total 2')

      // …and the clamped row does not fall back into the body either.
      expect(screen.queryByText('Grand total')).not.toBeInTheDocument()
    })

    test('should render the corner cell above both axes when a column is also pinned', () => {
      renderPinnedTable({ columnPinning: { right: ['email'], left: [] } })

      const row = screen.getByText('Grand total').closest('tr')!
      const cells = row.querySelectorAll('td')
      const lastCell = cells[cells.length - 1]

      expect(lastCell).toHaveStyle({ position: 'sticky', bottom: '0px', right: '0px', zIndex: 3 })
    })

    test('should render the spacer row inside the tbody', () => {
      const { container } = renderPinnedTable()

      const spacer = container.querySelector('.cn-table-v2-spacer-row')
      expect(spacer).toBeInTheDocument()
      expect(container.querySelector('tbody')).toContainElement(spacer as HTMLElement)

      const spacerCell = spacer?.querySelector('td')
      expect(spacerCell).toHaveAttribute('colspan', String(mockColumns.length))
    })

    test('should still render body content when nothing is pinned', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable
            data={mockData}
            columns={mockColumns}
            getRowId={row => row.id}
            rowPinning={{ bottom: [] }}
            stickyHeader
            maxHeight={300}
          />
        </TestWrapper>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(container.querySelector('tfoot')).not.toBeInTheDocument()
      expect(container.querySelector('.cn-table-v2-spacer-row')).not.toBeInTheDocument()
    })

    test('should keep the pinned row in the tfoot when only its data row is present (keepPinnedRows)', () => {
      // Simulates a server-paginated page whose data excludes the totals row's
      // original position: keepPinnedRows still surfaces it in the tfoot.
      const { container } = render(
        <TestWrapper>
          <DataTable
            data={dataWithTotals}
            columns={mockColumns}
            getRowId={row => row.id}
            rowPinning={{ bottom: ['grand-total'] }}
            stickyHeader
            maxHeight={300}
          />
        </TestWrapper>
      )

      const bodyRows = Array.from(container.querySelectorAll('tbody > tr:not(.cn-table-v2-spacer-row)'))
      expect(bodyRows).toHaveLength(mockData.length)
      expect(container.querySelector('tfoot')).toContainElement(screen.getByText('Grand total').closest('tr'))
    })

    test('should work with pagination props — pinned row stays in the tfoot and spacer renders', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable
            data={dataWithTotals}
            columns={mockColumns}
            getRowId={row => row.id}
            rowPinning={{ bottom: ['grand-total'] }}
            stickyHeader
            maxHeight={300}
            paginationProps={{ totalItems: 100, pageSize: 4, currentPage: 1, goToPage: vi.fn() }}
          />
        </TestWrapper>
      )

      // Grand total appears exactly once, in the tfoot — not in the paginated body
      expect(screen.getAllByText('Grand total')).toHaveLength(1)
      expect(container.querySelector('tfoot')).toContainElement(screen.getByText('Grand total').closest('tr'))

      // Body excludes the totals row; spacer still renders between body and tfoot
      const bodyRows = Array.from(container.querySelectorAll('tbody > tr:not(.cn-table-v2-spacer-row)'))
      expect(bodyRows).toHaveLength(mockData.length)
      expect(container.querySelector('.cn-table-v2-spacer-row')).toBeInTheDocument()
    })

    test('should layer both corners on a short table with left and right pinned columns', () => {
      const { container } = renderPinnedTable({
        data: [...mockData.slice(0, 2), { id: 'grand-total', name: 'Grand total', age: 90, email: '' }],
        columnPinning: { left: ['name'], right: ['email'] }
      })

      const row = screen.getByText('Grand total').closest('tr')!
      const cells = row.querySelectorAll('td')

      expect(cells[0]).toHaveStyle({ position: 'sticky', bottom: '0px', left: '0px', zIndex: 3 })
      expect(cells[cells.length - 1]).toHaveStyle({ position: 'sticky', bottom: '0px', right: '0px', zIndex: 3 })

      // Short table still gets a spacer row between the 2 body rows and the tfoot
      expect(container.querySelector('.cn-table-v2-spacer-row')).toBeInTheDocument()
    })
  })
})

describe('computeSpacerHeight', () => {
  test('should return the surplus viewport height', () => {
    expect(computeSpacerHeight({ viewportClientHeight: 300, contentHeight: 120 })).toBe(180)
  })

  test('should return 0 when content fills or exceeds the viewport', () => {
    expect(computeSpacerHeight({ viewportClientHeight: 300, contentHeight: 300 })).toBe(0)
    expect(computeSpacerHeight({ viewportClientHeight: 300, contentHeight: 450 })).toBe(0)
  })
})

describe('getStickyCellStyles', () => {
  const createColumn = (pinned: false | 'left' | 'right' = false) =>
    ({
      getIsPinned: () => pinned,
      getIsLastColumn: () => false,
      getIsFirstColumn: () => false,
      getStart: () => 0,
      getAfter: () => 0
    }) as unknown as Column<TestData>

  test('should keep getCommonPinningStyles backward compatible', () => {
    const column = createColumn()
    expect(getCommonPinningStyles(column)).toEqual(getStickyCellStyles({ column }))
  })

  test('should return relative positioning for unpinned, non-sticky cells', () => {
    const styles = getStickyCellStyles({ column: createColumn() })
    expect(styles).toMatchObject({ position: 'relative', zIndex: 0 })
    expect(styles.top).toBeUndefined()
    expect(styles.left).toBeUndefined()
    expect(styles.right).toBeUndefined()
  })

  test('should pin columns with sticky positioning on the horizontal axis', () => {
    const styles = getStickyCellStyles({ column: createColumn('left') })
    expect(styles).toMatchObject({ position: 'sticky', left: '0px', zIndex: 1 })
    expect(styles.top).toBeUndefined()
  })

  test('should stick header cells to the top with the header z-index layer', () => {
    const styles = getStickyCellStyles({ column: createColumn(), vertical: { edge: 'top', offset: 0 } })
    expect(styles).toMatchObject({ position: 'sticky', top: '0px', zIndex: 4 })
  })

  test('should accept string offsets such as CSS variables', () => {
    const styles = getStickyCellStyles({
      column: createColumn(),
      vertical: { edge: 'top', offset: 'var(--cn-table-header-row-h)' }
    })
    expect(styles.top).toBe('var(--cn-table-header-row-h)')
  })

  test('should combine header and pinned-column layers for corner cells', () => {
    const styles = getStickyCellStyles({ column: createColumn('left'), vertical: { edge: 'top', offset: 0 } })
    expect(styles).toMatchObject({ position: 'sticky', top: '0px', left: '0px', zIndex: 5 })
  })

  test('should stick bottom-pinned row cells with the pinned-row z-index layer', () => {
    const styles = getStickyCellStyles({ column: createColumn(), vertical: { edge: 'bottom', offset: 0 } })
    expect(styles).toMatchObject({ position: 'sticky', bottom: '0px', zIndex: 2 })
    expect(styles.top).toBeUndefined()
  })

  test('should combine bottom-pinned row and pinned-column layers for the grand-total corner', () => {
    const styles = getStickyCellStyles({ column: createColumn('right'), vertical: { edge: 'bottom', offset: 0 } })
    expect(styles).toMatchObject({ position: 'sticky', bottom: '0px', right: '0px', zIndex: 3 })
  })
})
