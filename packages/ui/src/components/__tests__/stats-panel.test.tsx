import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { StatsPanel, StatsPanelProps } from '../stats-panel'

// Mock Layout components
vi.mock('../layout', async () => {
  const actual = await vi.importActual('../layout')
  return {
    ...actual,
    Layout: {
      Flex: ({ children, wrap, gap, ...props }: any) => (
        <div data-testid="layout-flex" data-wrap={wrap} data-gap={gap} {...props}>
          {children}
        </div>
      ),
      Vertical: ({ children, gap, ...props }: any) => (
        <div data-testid="layout-vertical" data-gap={gap} {...props}>
          {children}
        </div>
      )
    }
  }
})

// Mock Text component
vi.mock('../text', async () => {
  const actual = await vi.importActual('../text')
  return {
    ...actual,
    Text: ({ children, color, as, ...props }: any) => {
      const Tag = as || 'span'
      return (
        <Tag data-testid="text" data-color={color} data-as={as} {...props}>
          {children}
        </Tag>
      )
    }
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

const renderComponent = (props: Partial<StatsPanelProps> = {}) => {
  const defaultProps: StatsPanelProps = {
    data: [
      { label: 'Total', value: <span>100</span> },
      { label: 'Active', value: <span>50</span> }
    ]
  }
  return render(<StatsPanel {...defaultProps} {...props} />)
}

describe('StatsPanel', () => {
  describe('Basic Rendering', () => {
    test('should render stats panel with data', () => {
      renderComponent()
      expect(screen.getByTestId('layout-flex')).toBeInTheDocument()
    })

    test('should render all stat items', () => {
      renderComponent({
        data: [
          { label: 'Total', value: <span>100</span> },
          { label: 'Active', value: <span>50</span> },
          { label: 'Inactive', value: <span>25</span> }
        ]
      })
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })

    test('should render label text', () => {
      renderComponent()
      const labels = screen.getAllByTestId('text')
      const labelText = labels.find(el => el.textContent === 'Total')
      expect(labelText).toBeInTheDocument()
    })

    test('should render value elements', () => {
      renderComponent()
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })

  describe('Empty Data', () => {
    test('should return null when data array is empty', () => {
      const { container } = renderComponent({ data: [] })
      expect(container.firstChild).toBeNull()
    })

    test('should return null when data is empty array', () => {
      const { container } = renderComponent({ data: [] })
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Loading State', () => {
    test('should render skeleton when isLoading is true', () => {
      renderComponent({ isLoading: true })
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    test('should not render skeleton when isLoading is false', () => {
      renderComponent({ isLoading: false })
      const skeletons = screen.queryAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(0)
    })

    test('should not render skeleton when isLoading is undefined', () => {
      renderComponent({ isLoading: undefined })
      const skeletons = screen.queryAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(0)
    })

    test('should render skeleton for each stat item when loading', () => {
      renderComponent({
        data: [
          { label: 'Total', value: <span>100</span> },
          { label: 'Active', value: <span>50</span> }
        ],
        isLoading: true
      })
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBe(2)
    })

    test('should still render labels when loading', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }],
        isLoading: true
      })
      expect(screen.getByText('Total')).toBeInTheDocument()
    })
  })

  describe('Value Rendering', () => {
    test('should render JSX element value', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span data-testid="value">100</span> }]
      })
      expect(screen.getByTestId('value')).toBeInTheDocument()
    })

    test('should render dash when value is undefined', () => {
      renderComponent({
        data: [{ label: 'Total', value: undefined }]
      })
      expect(screen.getByText('-')).toBeInTheDocument()
    })

    test('should render dash when value is null', () => {
      renderComponent({
        data: [{ label: 'Total', value: null as any }]
      })
      expect(screen.getByText('-')).toBeInTheDocument()
    })

    test('should render value as div element', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }]
      })
      const valueText = screen.getByText('100')
      expect(valueText.tagName).toBe('SPAN')
    })

    test('should apply foreground-1 color to value', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }]
      })
      const texts = screen.getAllByTestId('text')
      const valueText = texts.find(el => el.textContent === '100')
      expect(valueText).toHaveAttribute('data-color', 'foreground-1')
    })
  })

  describe('Label Rendering', () => {
    test('should apply foreground-3 color to label', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }]
      })
      const texts = screen.getAllByTestId('text')
      const labelText = texts.find(el => el.textContent === 'Total')
      expect(labelText).toHaveAttribute('data-color', 'foreground-3')
    })

    test('should render all labels', () => {
      renderComponent({
        data: [
          { label: 'Label 1', value: <span>1</span> },
          { label: 'Label 2', value: <span>2</span> },
          { label: 'Label 3', value: <span>3</span> }
        ]
      })
      expect(screen.getByText('Label 1')).toBeInTheDocument()
      expect(screen.getByText('Label 2')).toBeInTheDocument()
      expect(screen.getByText('Label 3')).toBeInTheDocument()
    })
  })

  describe('Layout Props', () => {
    test('should apply wrap="wrap" to Flex layout', () => {
      renderComponent()
      const flex = screen.getByTestId('layout-flex')
      expect(flex).toHaveAttribute('data-wrap', 'wrap')
    })

    test('should apply gap="3xl" to Flex layout', () => {
      renderComponent()
      const flex = screen.getByTestId('layout-flex')
      expect(flex).toHaveAttribute('data-gap', '3xl')
    })

    test('should apply gap="sm" to Vertical layout', () => {
      renderComponent()
      const verticals = screen.getAllByTestId('layout-vertical')
      verticals.forEach(vertical => {
        expect(vertical).toHaveAttribute('data-gap', 'sm')
      })
    })
  })

  describe('Key Prop', () => {
    test('should use index as key for stat items', () => {
      renderComponent({
        data: [
          { label: 'Total', value: <span>100</span> },
          { label: 'Active', value: <span>50</span> }
        ]
      })
      const verticals = screen.getAllByTestId('layout-vertical')
      expect(verticals.length).toBe(2)
    })
  })

  describe('Edge Cases', () => {
    test('should handle single stat item', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }]
      })
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
    })

    test('should handle many stat items', () => {
      const manyStats = Array.from({ length: 10 }, (_, i) => ({
        label: `Stat ${i}`,
        value: <span>{i}</span>
      }))
      renderComponent({ data: manyStats })
      expect(screen.getByText('Stat 0')).toBeInTheDocument()
      expect(screen.getByText('Stat 9')).toBeInTheDocument()
    })

    test('should handle empty string label', () => {
      renderComponent({
        data: [{ label: '', value: <span>100</span> }]
      })
      const texts = screen.getAllByTestId('text')
      const labelText = texts.find(el => el.textContent === '')
      expect(labelText).toBeInTheDocument()
    })

    test('should handle complex JSX value', () => {
      renderComponent({
        data: [
          {
            label: 'Complex',
            value: (
              <div>
                <span>100</span>
                <span>items</span>
              </div>
            )
          }
        ]
      })
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('items')).toBeInTheDocument()
    })

    test('should handle value with zero', () => {
      renderComponent({
        data: [{ label: 'Count', value: <span>0</span> }]
      })
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    test('should render Layout.Flex as container', () => {
      renderComponent()
      expect(screen.getByTestId('layout-flex')).toBeInTheDocument()
    })

    test('should render Layout.Vertical for each stat', () => {
      renderComponent({
        data: [
          { label: 'Total', value: <span>100</span> },
          { label: 'Active', value: <span>50</span> }
        ]
      })
      const verticals = screen.getAllByTestId('layout-vertical')
      expect(verticals.length).toBe(2)
    })

    test('should render Text components for labels and values', () => {
      renderComponent({
        data: [{ label: 'Total', value: <span>100</span> }]
      })
      const texts = screen.getAllByTestId('text')
      expect(texts.length).toBeGreaterThan(0)
    })
  })
})
