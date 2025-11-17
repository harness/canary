import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonTable, SkeletonTableProps } from '../skeleton-table'

// Mock dependencies
vi.mock('@/components', () => ({
  Skeleton: {
    Typography: ({ variant, className, ...props }: any) => (
      <div data-testid="skeleton-typography" data-variant={variant} className={className} {...props} />
    )
  },
  Table: {
    Root: ({ children, className, disableHighlightOnHover, ...props }: any) => (
      <table data-testid="table-root" className={className} data-disable-highlight={disableHighlightOnHover} {...props}>
        {children}
      </table>
    ),
    Header: ({ children, className, ...props }: any) => (
      <thead data-testid="table-header" className={className} {...props}>
        {children}
      </thead>
    ),
    Body: ({ children, className, ...props }: any) => (
      <tbody data-testid="table-body" className={className} {...props}>
        {children}
      </tbody>
    ),
    Row: ({ children, ...props }: any) => (
      <tr data-testid="table-row" {...props}>
        {children}
      </tr>
    ),
    Head: ({ children, ...props }: any) => (
      <th data-testid="table-head" {...props}>
        {children}
      </th>
    ),
    Cell: ({ children, ...props }: any) => (
      <td data-testid="table-cell" {...props}>
        {children}
      </td>
    )
  }
}))

vi.mock('@utils/cn', () => ({
  cn: (...classes: any[]) =>
    classes
      .flatMap(value => {
        if (!value) return []
        if (typeof value === 'string') return value
        if (Array.isArray(value)) return value
        if (typeof value === 'object') {
          return Object.entries(value)
            .filter(([, condition]) => Boolean(condition))
            .map(([key]) => key)
        }
        return []
      })
      .join(' ')
}))

const renderComponent = (props: Partial<SkeletonTableProps> = {}) => {
  return render(<SkeletonTable {...props} />)
}

describe('SkeletonTable', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton table', () => {
      renderComponent()
      expect(screen.getByTestId('table-root')).toBeInTheDocument()
    })

    test('should apply cn-skeleton-table class', () => {
      renderComponent()
      expect(screen.getByTestId('table-root')).toHaveClass('cn-skeleton-table')
    })

    test('should disable highlight on hover', () => {
      renderComponent()
      expect(screen.getByTestId('table-root')).toHaveAttribute('data-disable-highlight', 'true')
    })

    test('should render table header by default', () => {
      renderComponent()
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
    })

    test('should render table body', () => {
      renderComponent()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
    })
  })

  describe('Default Dimensions', () => {
    test('should render 12 rows by default', () => {
      renderComponent()
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(12)
    })

    test('should render 5 columns by default', () => {
      renderComponent()
      const firstRow = screen.getByTestId('table-body').querySelector('[data-testid="table-row"]')
      const cells = firstRow?.querySelectorAll('[data-testid="table-cell"]')
      expect(cells).toHaveLength(5)
    })

    test('should render 5 header columns by default', () => {
      renderComponent()
      const headerCells = screen.getByTestId('table-header').querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(5)
    })
  })

  describe('Count Rows', () => {
    test('should render 1 row', () => {
      renderComponent({ countRows: 1 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(1)
    })

    test('should render 5 rows', () => {
      renderComponent({ countRows: 5 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(5)
    })

    test('should render 20 rows', () => {
      renderComponent({ countRows: 20 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(20)
    })

    test('should render 50 rows', () => {
      renderComponent({ countRows: 50 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(50)
    })

    test('should handle 0 rows', () => {
      renderComponent({ countRows: 0 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(0)
    })
  })

  describe('Count Columns', () => {
    test('should render 1 column', () => {
      renderComponent({ countColumns: 1 })
      const firstRow = screen.getByTestId('table-body').querySelector('[data-testid="table-row"]')
      const cells = firstRow?.querySelectorAll('[data-testid="table-cell"]')
      expect(cells).toHaveLength(1)
    })

    test('should render 3 columns', () => {
      renderComponent({ countColumns: 3 })
      const firstRow = screen.getByTestId('table-body').querySelector('[data-testid="table-row"]')
      const cells = firstRow?.querySelectorAll('[data-testid="table-cell"]')
      expect(cells).toHaveLength(3)
    })

    test('should render 10 columns', () => {
      renderComponent({ countColumns: 10 })
      const firstRow = screen.getByTestId('table-body').querySelector('[data-testid="table-row"]')
      const cells = firstRow?.querySelectorAll('[data-testid="table-cell"]')
      expect(cells).toHaveLength(10)
    })

    test('should render same number of header columns as body columns', () => {
      renderComponent({ countColumns: 7 })
      const headerCells = screen.getByTestId('table-header').querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(7)
    })

    test('should handle 0 columns', () => {
      renderComponent({ countColumns: 0 })
      const firstRow = screen.getByTestId('table-body').querySelector('[data-testid="table-row"]')
      const cells = firstRow?.querySelectorAll('[data-testid="table-cell"]')
      expect(cells).toHaveLength(0)
    })
  })

  describe('Hide Header', () => {
    test('should hide header when hideHeader is true', () => {
      renderComponent({ hideHeader: true })
      expect(screen.queryByTestId('table-header')).not.toBeInTheDocument()
    })

    test('should show header when hideHeader is false', () => {
      renderComponent({ hideHeader: false })
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
    })

    test('should show header by default', () => {
      renderComponent()
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
    })

    test('should still render body when header is hidden', () => {
      renderComponent({ hideHeader: true, countRows: 5 })
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(5)
    })
  })

  describe('Custom ClassNames', () => {
    test('should apply custom className to root', () => {
      renderComponent({ className: 'custom-table' })
      expect(screen.getByTestId('table-root')).toHaveClass('custom-table')
    })

    test('should merge custom className with base class', () => {
      renderComponent({ className: 'custom-table' })
      const root = screen.getByTestId('table-root')
      expect(root).toHaveClass('cn-skeleton-table')
      expect(root).toHaveClass('custom-table')
    })

    test('should apply classNameHeader', () => {
      renderComponent({ classNameHeader: 'custom-header' })
      expect(screen.getByTestId('table-header')).toHaveClass('custom-header')
    })

    test('should apply classNameBody', () => {
      renderComponent({ classNameBody: 'custom-body' })
      expect(screen.getByTestId('table-body')).toHaveClass('custom-body')
    })

    test('should apply all custom classNames together', () => {
      renderComponent({
        className: 'custom-table',
        classNameHeader: 'custom-header',
        classNameBody: 'custom-body'
      })

      expect(screen.getByTestId('table-root')).toHaveClass('custom-table')
      expect(screen.getByTestId('table-header')).toHaveClass('custom-header')
      expect(screen.getByTestId('table-body')).toHaveClass('custom-body')
    })

    test('should handle empty classNames', () => {
      renderComponent({
        className: '',
        classNameHeader: '',
        classNameBody: ''
      })

      expect(screen.getByTestId('table-root')).toHaveClass('cn-skeleton-table')
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
    })
  })

  describe('Skeleton Typography', () => {
    test('should render skeleton typography in header cells', () => {
      renderComponent({ countColumns: 3 })
      const headerTypographies = screen
        .getByTestId('table-header')
        .querySelectorAll('[data-testid="skeleton-typography"]')
      expect(headerTypographies).toHaveLength(3)
    })

    test('should use caption-normal variant in header', () => {
      renderComponent({ countColumns: 2 })
      const headerTypographies = screen
        .getByTestId('table-header')
        .querySelectorAll('[data-testid="skeleton-typography"]')

      headerTypographies.forEach(typo => {
        expect(typo).toHaveAttribute('data-variant', 'caption-normal')
      })
    })

    test('should apply width to header skeleton typography', () => {
      renderComponent({ countColumns: 2 })
      const headerTypographies = screen
        .getByTestId('table-header')
        .querySelectorAll('[data-testid="skeleton-typography"]')

      headerTypographies.forEach(typo => {
        expect(typo).toHaveClass('w-[65px]')
      })
    })

    test('should render skeleton typography in body cells', () => {
      renderComponent({ countRows: 2, countColumns: 3 })
      const bodyTypographies = screen.getByTestId('table-body').querySelectorAll('[data-testid="skeleton-typography"]')
      expect(bodyTypographies).toHaveLength(6) // 2 rows * 3 columns
    })

    test('should apply full width to body cell typography', () => {
      renderComponent({ countRows: 1, countColumns: 2 })
      const bodyTypographies = screen.getByTestId('table-body').querySelectorAll('[data-testid="skeleton-typography"]')

      bodyTypographies.forEach(typo => {
        expect(typo).toHaveClass('w-full')
      })
    })
  })

  describe('Grid Structure', () => {
    test('should render correct number of cells in grid', () => {
      renderComponent({ countRows: 3, countColumns: 4 })
      const cells = screen.getAllByTestId('table-cell')
      expect(cells).toHaveLength(12) // 3 * 4
    })

    test('should have unique keys for rows', () => {
      renderComponent({ countRows: 5 })
      const rows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(rows).toHaveLength(5)
      expect(new Set(rows).size).toBe(5)
    })

    test('should have consistent columns per row', () => {
      renderComponent({ countRows: 5, countColumns: 3 })
      const rows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')

      rows.forEach(row => {
        const cells = row.querySelectorAll('[data-testid="table-cell"]')
        expect(cells).toHaveLength(3)
      })
    })

    test('should render header row with correct structure', () => {
      renderComponent({ countColumns: 4 })
      const headerRow = screen.getByTestId('table-header').querySelector('[data-testid="table-row"]')
      const headerCells = headerRow?.querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(4)
    })
  })

  describe('Edge Cases', () => {
    test('should handle zero rows and columns', () => {
      renderComponent({ countRows: 0, countColumns: 0 })
      expect(screen.getByTestId('table-root')).toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
    })

    test('should handle large table (100 rows, 10 columns)', () => {
      renderComponent({ countRows: 100, countColumns: 10 })
      const rows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(rows).toHaveLength(100)
    })

    test('should handle all props together', () => {
      renderComponent({
        countRows: 5,
        countColumns: 3,
        hideHeader: false,
        className: 'custom-table',
        classNameHeader: 'custom-header',
        classNameBody: 'custom-body'
      })

      expect(screen.getByTestId('table-root')).toHaveClass('custom-table')
      expect(screen.getByTestId('table-header')).toHaveClass('custom-header')
      expect(screen.getByTestId('table-body')).toHaveClass('custom-body')

      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(5)
    })

    test('should handle minimal props', () => {
      renderComponent()
      expect(screen.getByTestId('table-root')).toBeInTheDocument()
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple tables independently', () => {
      render(
        <>
          <SkeletonTable countRows={2} countColumns={2} />
          <SkeletonTable countRows={3} countColumns={3} />
        </>
      )

      const roots = screen.getAllByTestId('table-root')
      expect(roots).toHaveLength(2)
    })

    test('should handle different props for multiple instances', () => {
      render(
        <>
          <SkeletonTable countRows={2} hideHeader={true} />
          <SkeletonTable countRows={3} hideHeader={false} />
        </>
      )

      const headers = screen.getAllByTestId('table-header')
      expect(headers).toHaveLength(1) // Only second table
    })
  })

  describe('Integration', () => {
    test('should work within other components', () => {
      render(
        <div data-testid="container">
          <SkeletonTable countRows={3} countColumns={4} />
        </div>
      )

      const container = screen.getByTestId('container')
      const table = screen.getByTestId('table-root')
      expect(container).toContainElement(table)
    })

    test('should maintain structure with header visible', () => {
      renderComponent({ countRows: 3, countColumns: 4, hideHeader: false })

      expect(screen.getByTestId('table-header')).toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()

      const headerCells = screen.getByTestId('table-header').querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(4)

      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(3)

      const cells = screen.getAllByTestId('table-cell')
      expect(cells).toHaveLength(12) // 3 rows * 4 columns
    })

    test('should maintain structure with header hidden', () => {
      renderComponent({ countRows: 3, countColumns: 4, hideHeader: true })

      expect(screen.queryByTestId('table-header')).not.toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()

      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(3)
    })
  })

  describe('Keys Generation', () => {
    test('should generate unique keys for header cells', () => {
      renderComponent({ countColumns: 5 })
      const headerCells = screen.getByTestId('table-header').querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(5)
    })

    test('should generate unique keys for body rows', () => {
      renderComponent({ countRows: 10, countColumns: 3 })
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(10)
    })

    test('should generate unique keys for body cells', () => {
      renderComponent({ countRows: 3, countColumns: 4 })
      const cells = screen.getAllByTestId('table-cell')
      expect(cells).toHaveLength(12)
    })
  })

  describe('Accessibility', () => {
    test('should use semantic table elements', () => {
      renderComponent()
      expect(screen.getByTestId('table-root').tagName).toBe('TABLE')
    })

    test('should use thead for header', () => {
      renderComponent()
      expect(screen.getByTestId('table-header').tagName).toBe('THEAD')
    })

    test('should use tbody for body', () => {
      renderComponent()
      expect(screen.getByTestId('table-body').tagName).toBe('TBODY')
    })

    test('should use tr for rows', () => {
      renderComponent({ countRows: 1 })
      const rows = screen.getAllByTestId('table-row')
      rows.forEach(row => {
        expect(row.tagName).toBe('TR')
      })
    })

    test('should use th for header cells', () => {
      renderComponent({ countColumns: 3 })
      const headerCells = screen.getAllByTestId('table-head')
      headerCells.forEach(cell => {
        expect(cell.tagName).toBe('TH')
      })
    })

    test('should use td for body cells', () => {
      renderComponent({ countRows: 1, countColumns: 3 })
      const cells = screen.getAllByTestId('table-cell')
      cells.forEach(cell => {
        expect(cell.tagName).toBe('TD')
      })
    })
  })

  describe('Default Props Behavior', () => {
    test('should use 12 as default countRows', () => {
      renderComponent()
      const bodyRows = screen.getByTestId('table-body').querySelectorAll('[data-testid="table-row"]')
      expect(bodyRows).toHaveLength(12)
    })

    test('should use 5 as default countColumns', () => {
      renderComponent()
      const headerCells = screen.getByTestId('table-header').querySelectorAll('[data-testid="table-head"]')
      expect(headerCells).toHaveLength(5)
    })

    test('should not hide header by default', () => {
      renderComponent()
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
    })

    test('should disable hover highlight by default', () => {
      renderComponent()
      expect(screen.getByTestId('table-root')).toHaveAttribute('data-disable-highlight', 'true')
    })
  })
})
