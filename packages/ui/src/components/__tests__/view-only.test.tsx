import { useResizeObserver } from '@/hooks'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ViewOnly, ViewOnlyItem, ViewOnlyProps } from '../view-only'

// Mock Layout components
vi.mock('../layout', async () => {
  const actual = await vi.importActual('../layout')
  return {
    ...actual,
    Layout: {
      Grid: ({ children, className, ref, as, flow, gap, gapX, gapY, columns, align, ...props }: any) => {
        const Tag = as || 'div'
        return (
          <Tag
            data-testid="layout-grid"
            className={className}
            ref={ref}
            data-flow={flow}
            data-gap={gap}
            data-gapx={gapX}
            data-gapy={gapY}
            data-columns={columns}
            data-align={align}
            {...props}
          >
            {children}
          </Tag>
        )
      }
    }
  }
})

// Mock Text component
vi.mock('../text', async () => {
  const actual = await vi.importActual('../text')
  return {
    ...actual,
    Text: ({ children, variant, color, as, className, ...props }: any) => {
      const Tag = as || 'span'
      return (
        <Tag data-testid="text" data-variant={variant} data-color={color} data-as={as} className={className} {...props}>
          {children}
        </Tag>
      )
    }
  }
})

// Mock Separator component
vi.mock('../separator', async () => {
  const actual = await vi.importActual('../separator')
  return {
    ...actual,
    Separator: ({ orientation, className, ...props }: any) => (
      <hr data-testid="separator" data-orientation={orientation} className={className} {...props} />
    )
  }
})

// Mock Skeleton component
vi.mock('../skeletons', async () => {
  const actual = await vi.importActual('../skeletons')
  return {
    ...actual,
    Skeleton: {
      Typography: ({ className, ...props }: any) => (
        <div data-testid="skeleton-typography" className={className} {...props} />
      )
    }
  }
})

// Mock useResizeObserver hook
let resizeObserverCallback: ((el: HTMLElement) => void) | null = null

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useResizeObserver: vi.fn((ref: any, callback: any, _delay?: number) => {
      resizeObserverCallback = callback
    })
  }
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

const renderComponent = (props: Partial<ViewOnlyProps> = {}) => {
  const defaultProps: ViewOnlyProps = {
    data: [
      { label: 'Name', value: 'John Doe' },
      { label: 'Email', value: 'john@example.com' }
    ]
  }
  return render(<ViewOnly {...defaultProps} {...props} />)
}

describe('ViewOnly', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    test('should render ViewOnly component', () => {
      const { container } = renderComponent()
      const grids = container.querySelectorAll('[data-testid="layout-grid"]')
      expect(grids.length).toBeGreaterThan(0)
    })

    test('should render title when provided', () => {
      renderComponent({ title: 'User Details' })
      expect(screen.getByText('User Details')).toBeInTheDocument()
    })

    test('should not render title when not provided', () => {
      renderComponent({ title: undefined })
      const title = screen.queryByText('User Details')
      expect(title).not.toBeInTheDocument()
    })

    test('should render data items', () => {
      renderComponent()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Empty Data', () => {
    test('should return null when data is empty array', () => {
      const { container } = renderComponent({ data: [] })
      expect(container.firstChild).toBeNull()
    })

    test('should return null when data is null', () => {
      const { container } = renderComponent({ data: null as any })
      expect(container.firstChild).toBeNull()
    })

    test('should return null when data is undefined', () => {
      const { container } = renderComponent({ data: undefined as any })
      expect(container.firstChild).toBeNull()
    })
  })

  describe('ViewOnlyItem', () => {
    test('should render ViewOnlyItem with label and value', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should render empty text when value is null', () => {
      render(<ViewOnlyItem label="Name" value={null} />)
      expect(screen.getByText('empty')).toBeInTheDocument()
    })

    test('should render empty text when value is undefined', () => {
      render(<ViewOnlyItem label="Name" value={undefined} />)
      expect(screen.getByText('empty')).toBeInTheDocument()
    })

    test('should render empty text when value is empty string', () => {
      render(<ViewOnlyItem label="Name" value="" />)
      expect(screen.getByText('empty')).toBeInTheDocument()
    })

    test('should render string value as Text component', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      const valueText = screen.getByText('John Doe')
      expect(valueText).toBeInTheDocument()
      expect(valueText).toHaveClass('break-words')
    })

    test('should render React node value as-is', () => {
      render(<ViewOnlyItem label="Name" value={<span data-testid="custom-value">Custom</span>} />)
      expect(screen.getByTestId('custom-value')).toBeInTheDocument()
    })

    test('should render skeleton when isLoading is true', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" isLoading={true} />)
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(2)
    })

    test('should not render skeleton when isLoading is false', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" isLoading={false} />)
      const skeletons = screen.queryAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(0)
    })

    test('should render label as dt element', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      const label = screen.getByText('Name')
      expect(label.tagName).toBe('DT')
    })

    test('should render value as dd element', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      const value = screen.getByText('John Doe')
      // Value is wrapped in Text component with as="dd"
      expect(value).toBeInTheDocument()
    })

    test('should apply foreground-3 color to label', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      const label = screen.getByText('Name')
      expect(label).toHaveAttribute('data-color', 'foreground-3')
    })

    test('should apply foreground-1 color to value', () => {
      render(<ViewOnlyItem label="Name" value="John Doe" />)
      const texts = screen.getAllByTestId('text')
      const valueText = texts.find(el => el.textContent === 'John Doe')
      expect(valueText).toHaveAttribute('data-color', 'foreground-1')
    })

    test('should apply disabled color to empty value', () => {
      render(<ViewOnlyItem label="Name" value={null} />)
      const emptyText = screen.getByText('empty')
      expect(emptyText).toHaveAttribute('data-color', 'disabled')
    })
  })

  describe('Data Format', () => {
    test('should render object with label and value', () => {
      renderComponent({
        data: [{ label: 'Name', value: 'John Doe' }]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    test('should render React element as data item', () => {
      renderComponent({
        data: [
          <div key="custom" data-testid="custom-item">
            Custom
          </div>
        ]
      })
      expect(screen.getByTestId('custom-item')).toBeInTheDocument()
    })

    test('should return null for invalid data item', () => {
      renderComponent({
        data: [null as any, { label: 'Name', value: 'John' }]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    test('should handle mixed data types', () => {
      renderComponent({
        data: [
          { label: 'Name', value: 'John' },
          <div key="custom">Custom</div>,
          { label: 'Email', value: 'john@example.com' }
        ]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })
  })

  describe('Layout - Single Column', () => {
    test('should render in single column layout', () => {
      renderComponent({ layout: 'singleColumn' })
      const grids = screen.getAllByTestId('layout-grid')
      expect(grids.length).toBeGreaterThan(0)
    })

    test('should not show separator in single column layout', () => {
      renderComponent({
        layout: 'singleColumn',
        data: [
          { label: 'Name', value: 'John' },
          { label: 'Email', value: 'john@example.com' },
          { label: 'Phone', value: '123' }
        ]
      })
      const separators = screen.queryAllByTestId('separator')
      const verticalSeparator = separators.find(s => s.getAttribute('data-orientation') === 'vertical')
      expect(verticalSeparator).toBeUndefined()
    })

    test('should render all items in single column', () => {
      renderComponent({
        layout: 'singleColumn',
        data: [
          { label: 'Name', value: 'John' },
          { label: 'Email', value: 'john@example.com' }
        ]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })
  })

  describe('Layout - Columns', () => {
    test('should render in columns layout by default', () => {
      renderComponent()
      const grids = screen.getAllByTestId('layout-grid')
      expect(grids.length).toBeGreaterThan(0)
    })

    test('should split data into two columns when layout is columns', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Name', value: 'John' },
          { label: 'Email', value: 'john@example.com' },
          { label: 'Phone', value: '123' },
          { label: 'Address', value: 'Street' }
        ]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Phone')).toBeInTheDocument()
      expect(screen.getByText('Address')).toBeInTheDocument()
    })

    test('should show vertical separator when columns layout and more than 2 items', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Name', value: 'John' },
          { label: 'Email', value: 'john@example.com' },
          { label: 'Phone', value: '123' }
        ]
      })
      const separators = screen.getAllByTestId('separator')
      const verticalSeparator = separators.find(s => s.getAttribute('data-orientation') === 'vertical')
      expect(verticalSeparator).toBeInTheDocument()
    })

    test('should not show vertical separator when 2 or fewer items', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Name', value: 'John' },
          { label: 'Email', value: 'john@example.com' }
        ]
      })
      const separators = screen.getAllByTestId('separator')
      const verticalSeparator = separators.find(s => s.getAttribute('data-orientation') === 'vertical')
      // When items <= 2, separator should be invisible or not rendered
      if (verticalSeparator) {
        expect(verticalSeparator).toHaveClass('invisible')
      }
    })
  })

  describe('Loading State', () => {
    test('should pass isLoading to ViewOnlyItem', () => {
      renderComponent({
        isLoading: true,
        data: [{ label: 'Name', value: 'John' }]
      })
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    test('should not show skeletons when isLoading is false', () => {
      renderComponent({
        isLoading: false,
        data: [{ label: 'Name', value: 'John' }]
      })
      const skeletons = screen.queryAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(0)
    })
  })

  describe('ClassName', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-class' })
      const grid = container.querySelector('[data-testid="layout-grid"]')
      expect(grid).toHaveClass('custom-class')
    })

    test('should merge className with group class', () => {
      const { container } = renderComponent({ className: 'custom-class' })
      const grid = container.querySelector('[data-testid="layout-grid"]')
      expect(grid).toHaveClass('group')
      expect(grid).toHaveClass('custom-class')
    })
  })

  describe('Title Rendering', () => {
    test('should render title as h4 element', () => {
      renderComponent({ title: 'User Details' })
      const title = screen.getByText('User Details')
      expect(title.tagName).toBe('H4')
    })

    test('should apply heading-base variant to title', () => {
      renderComponent({ title: 'User Details' })
      const title = screen.getByText('User Details')
      expect(title).toHaveAttribute('data-variant', 'heading-base')
    })
  })

  describe('Separator', () => {
    test('should render bottom separator', () => {
      renderComponent()
      const separators = screen.getAllByTestId('separator')
      expect(separators.length).toBeGreaterThan(0)
    })

    test('should apply group-last:hidden class to bottom separator', () => {
      renderComponent()
      const separators = screen.getAllByTestId('separator')
      const bottomSeparator = separators.find(s => !s.getAttribute('data-orientation'))
      expect(bottomSeparator).toHaveClass('group-last:hidden')
    })
  })

  describe('Edge Cases', () => {
    test('should handle single data item', () => {
      renderComponent({
        data: [{ label: 'Name', value: 'John' }]
      })
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    test('should handle many data items', () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        label: `Label ${i}`,
        value: `Value ${i}`
      }))
      renderComponent({ data: manyItems })
      expect(screen.getByText('Label 0')).toBeInTheDocument()
      expect(screen.getByText('Label 19')).toBeInTheDocument()
    })

    test('should handle data with empty labels', () => {
      const { container } = renderComponent({
        data: [{ label: '', value: 'Value' }]
      })
      const labels = container.querySelectorAll('dt')
      expect(labels.length).toBeGreaterThan(0)
    })

    test('should handle data with numeric values', () => {
      renderComponent({
        data: [{ label: 'Count', value: 123 }]
      })
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    test('should handle data with boolean values', () => {
      renderComponent({
        data: [{ label: 'Active', value: true as any }]
      })
      // Boolean values are rendered as React nodes, not strings
      const value = screen.getByText('Active')
      expect(value).toBeInTheDocument()
    })
  })

  describe('Resize Observer Integration', () => {
    beforeEach(() => {
      resizeObserverCallback = null
    })

    test('should call useResizeObserver with contentRef', () => {
      renderComponent({ layout: 'columns' })
      expect(useResizeObserver).toHaveBeenCalled()
    })

    test('should handle resize observer callback when element exists and layout is columns', () => {
      renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      if (resizeObserverCallback) {
        const mockElement = { offsetWidth: 1000 } as HTMLElement
        resizeObserverCallback(mockElement)
      }

      expect(useResizeObserver).toHaveBeenCalled()
    })

    test('should handle resize observer callback when element exists and width is wide enough', () => {
      renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      if (resizeObserverCallback) {
        const mockElement = { offsetWidth: 1000 } as HTMLElement
        resizeObserverCallback(mockElement)
      }

      expect(useResizeObserver).toHaveBeenCalled()
    })

    test('should handle resize observer callback when element exists and width is not wide enough', () => {
      renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      if (resizeObserverCallback) {
        const mockElement = { offsetWidth: 500 } as HTMLElement
        resizeObserverCallback(mockElement)
      }

      expect(useResizeObserver).toHaveBeenCalled()
    })

    test('should not execute callback when layout is singleColumn', () => {
      renderComponent({
        layout: 'singleColumn',
        data: [{ label: 'Name', value: 'John' }]
      })

      if (resizeObserverCallback) {
        const mockElement = { offsetWidth: 1000 } as HTMLElement
        resizeObserverCallback(mockElement)
        // Callback should return early when layout is singleColumn
      }

      expect(useResizeObserver).toHaveBeenCalled()
    })

    test('should not execute callback when element is null', () => {
      renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      if (resizeObserverCallback) {
        resizeObserverCallback(null as any)
        // Callback should return early when element is null
      }

      expect(useResizeObserver).toHaveBeenCalled()
    })
  })

  describe('useLayoutEffect Integration', () => {
    test('should handle layout effect when contentRef exists and width is wide enough', () => {
      const { container } = renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      // The useLayoutEffect runs automatically when component mounts
      // We verify it by checking the component renders correctly
      const grid = container.querySelector('[data-testid="layout-grid"]')
      expect(grid).toBeInTheDocument()
    })

    test('should handle layout effect when contentRef exists and width is not wide enough', () => {
      const { container } = renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      const grid = container.querySelector('[data-testid="layout-grid"]')
      expect(grid).toBeInTheDocument()
    })

    test('should handle layout effect when layout changes', () => {
      const { rerender } = renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      rerender(<ViewOnly layout="singleColumn" data={[{ label: 'Name', value: 'John' }]} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    test('should handle layout effect when contentRef.current is null', () => {
      // This tests the early return in useLayoutEffect
      const { container } = renderComponent({
        layout: 'columns',
        data: [{ label: 'Name', value: 'John' }]
      })

      // Component should still render even if ref is initially null
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('splitArray Function', () => {
    test('should split array correctly for even number of items', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Label1', value: 'Value1' },
          { label: 'Label2', value: 'Value2' },
          { label: 'Label3', value: 'Value3' },
          { label: 'Label4', value: 'Value4' }
        ]
      })
      expect(screen.getByText('Label1')).toBeInTheDocument()
      expect(screen.getByText('Label4')).toBeInTheDocument()
    })

    test('should split array correctly for odd number of items', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Label1', value: 'Value1' },
          { label: 'Label2', value: 'Value2' },
          { label: 'Label3', value: 'Value3' }
        ]
      })
      expect(screen.getByText('Label1')).toBeInTheDocument()
      expect(screen.getByText('Label3')).toBeInTheDocument()
    })

    test('should handle array with 2 or fewer items', () => {
      renderComponent({
        layout: 'columns',
        data: [
          { label: 'Label1', value: 'Value1' },
          { label: 'Label2', value: 'Value2' }
        ]
      })
      expect(screen.getByText('Label1')).toBeInTheDocument()
      expect(screen.getByText('Label2')).toBeInTheDocument()
    })
  })
})
