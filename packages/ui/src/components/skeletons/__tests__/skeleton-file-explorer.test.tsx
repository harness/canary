import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonFileExplorer, SkeletonFileExplorerProps } from '../skeloton-file-explorer'

// Mock dependencies
vi.mock('@/components', () => ({
  Layout: {
    Vertical: ({ children, gap, className, ...props }: any) => (
      <div data-testid="layout-vertical" data-gap={gap} className={className} {...props}>
        {children}
      </div>
    ),
    Horizontal: ({ children, gap, className, ...props }: any) => (
      <div data-testid="layout-horizontal" data-gap={gap} className={className} {...props}>
        {children}
      </div>
    )
  },
  Skeleton: {
    Icon: ({ size, ...props }: any) => <div data-testid="skeleton-icon" data-size={size} {...props} />,
    Typography: ({ style, className, ...props }: any) => (
      <div data-testid="skeleton-typography" style={style} className={className} {...props} />
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

const { getRandomPixelWidthMock } = vi.hoisted(() => ({
  getRandomPixelWidthMock: vi.fn((min: number, _max: number) => `${min}px`)
}))

vi.mock('../skeleton-utils', () => ({
  getRandomPixelWidth: getRandomPixelWidthMock
}))

beforeEach(() => {
  getRandomPixelWidthMock.mockReset()
  getRandomPixelWidthMock.mockImplementation((min: number, _max: number) => `${min}px`)
})

const renderComponent = (props: Partial<SkeletonFileExplorerProps> = {}) => {
  return render(<SkeletonFileExplorer {...props} />)
}

describe('SkeletonFileExplorer', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton file explorer', () => {
      renderComponent()
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()
    })

    test('should render default 1 line', () => {
      renderComponent()
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(1)
    })

    test('should render icon and typography per line', () => {
      renderComponent({ linesCount: 1 })
      expect(screen.getByTestId('skeleton-icon')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-typography')).toBeInTheDocument()
    })

    test('should apply gap 4xs to vertical layout', () => {
      renderComponent()
      expect(screen.getByTestId('layout-vertical')).toHaveAttribute('data-gap', '4xs')
    })

    test('should apply gap 2xs to horizontal layouts', () => {
      renderComponent()
      expect(screen.getByTestId('layout-horizontal')).toHaveAttribute('data-gap', '2xs')
    })
  })

  describe('Lines Count', () => {
    test('should render 1 line', () => {
      renderComponent({ linesCount: 1 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(1)
    })

    test('should render 3 lines', () => {
      renderComponent({ linesCount: 3 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(3)
    })

    test('should render 5 lines', () => {
      renderComponent({ linesCount: 5 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(5)
    })

    test('should render 10 lines', () => {
      renderComponent({ linesCount: 10 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(10)
    })

    test('should render 20 lines', () => {
      renderComponent({ linesCount: 20 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(20)
    })

    test('should handle 0 lines', () => {
      renderComponent({ linesCount: 0 })
      const horizontals = screen.queryAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(0)
    })
  })

  describe('Skeleton Icon', () => {
    test('should render icon with md size', () => {
      renderComponent({ linesCount: 1 })
      const icon = screen.getByTestId('skeleton-icon')
      expect(icon).toHaveAttribute('data-size', 'md')
    })

    test('should render one icon per line', () => {
      renderComponent({ linesCount: 5 })
      const icons = screen.getAllByTestId('skeleton-icon')
      expect(icons).toHaveLength(5)
    })

    test('should render icon in each horizontal layout', () => {
      renderComponent({ linesCount: 3 })
      const horizontals = screen.getAllByTestId('layout-horizontal')

      horizontals.forEach(horizontal => {
        const icon = horizontal.querySelector('[data-testid="skeleton-icon"]')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Skeleton Typography', () => {
    test('should render typography with random width', () => {
      renderComponent({ linesCount: 1 })
      const typography = screen.getByTestId('skeleton-typography')
      expect(typography).toHaveStyle({ width: '30px' })
    })

    test('should render one typography per line', () => {
      renderComponent({ linesCount: 5 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      expect(typographies).toHaveLength(5)
    })

    test('should apply full width class to typography', () => {
      renderComponent({ linesCount: 1 })
      const typography = screen.getByTestId('skeleton-typography')
      expect(typography).toHaveClass('w-full')
    })

    test('should render typography in each horizontal layout', () => {
      renderComponent({ linesCount: 3 })
      const horizontals = screen.getAllByTestId('layout-horizontal')

      horizontals.forEach(horizontal => {
        const typography = horizontal.querySelector('[data-testid="skeleton-typography"]')
        expect(typography).toBeInTheDocument()
      })
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className to vertical layout', () => {
      renderComponent({ className: 'custom-explorer' })
      expect(screen.getByTestId('layout-vertical')).toHaveClass('custom-explorer')
    })

    test('should apply cn-skeleton-file-explorer class when linesCount > 1', () => {
      renderComponent({ linesCount: 2 })
      expect(screen.getByTestId('layout-vertical')).toHaveClass('cn-skeleton-file-explorer')
    })

    test('should not apply cn-skeleton-file-explorer class when linesCount = 1', () => {
      renderComponent({ linesCount: 1 })
      const vertical = screen.getByTestId('layout-vertical')
      expect(vertical.className).not.toContain('cn-skeleton-file-explorer')
    })

    test('should merge custom className with base class when linesCount > 1', () => {
      renderComponent({ linesCount: 2, className: 'custom-explorer' })
      const vertical = screen.getByTestId('layout-vertical')
      expect(vertical).toHaveClass('cn-skeleton-file-explorer')
      expect(vertical).toHaveClass('custom-explorer')
    })

    test('should handle empty className', () => {
      renderComponent({ className: '' })
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()
    })

    test('should handle undefined className', () => {
      renderComponent({ className: undefined })
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    test('should have vertical layout as root', () => {
      renderComponent()
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()
    })

    test('should have horizontal layouts as children', () => {
      renderComponent({ linesCount: 3 })
      const vertical = screen.getByTestId('layout-vertical')
      const horizontals = vertical.querySelectorAll('[data-testid="layout-horizontal"]')
      expect(horizontals).toHaveLength(3)
    })

    test('should apply padding to horizontal layouts', () => {
      renderComponent({ linesCount: 2 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      horizontals.forEach(horizontal => {
        expect(horizontal).toHaveClass('p-cn-2xs')
      })
    })

    test('should nest icon and typography in horizontal layout', () => {
      renderComponent({ linesCount: 1 })
      const horizontal = screen.getByTestId('layout-horizontal')
      const icon = horizontal.querySelector('[data-testid="skeleton-icon"]')
      const typography = horizontal.querySelector('[data-testid="skeleton-typography"]')

      expect(icon).toBeInTheDocument()
      expect(typography).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle linesCount of 0', () => {
      renderComponent({ linesCount: 0 })
      const horizontals = screen.queryAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(0)
    })

    test('should handle large linesCount', () => {
      renderComponent({ linesCount: 50 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(50)
    })

    test('should handle all props together', () => {
      renderComponent({
        linesCount: 5,
        className: 'custom-class'
      })

      const vertical = screen.getByTestId('layout-vertical')
      expect(vertical).toHaveClass('custom-class')
      expect(vertical).toHaveClass('cn-skeleton-file-explorer')

      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(5)
    })

    test('should handle minimal props', () => {
      renderComponent()
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()
    })
  })

  describe('Default Props', () => {
    test('should use 1 as default linesCount', () => {
      renderComponent()
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(1)
    })

    test('should not apply cn-skeleton-file-explorer class for default linesCount', () => {
      renderComponent()
      const vertical = screen.getByTestId('layout-vertical')
      expect(vertical.className).not.toContain('cn-skeleton-file-explorer')
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple file explorers independently', () => {
      render(
        <>
          <SkeletonFileExplorer linesCount={2} />
          <SkeletonFileExplorer linesCount={3} />
        </>
      )

      const verticals = screen.getAllByTestId('layout-vertical')
      expect(verticals).toHaveLength(2)

      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(5) // 2 + 3
    })

    test('should handle different props for multiple instances', () => {
      render(
        <>
          <SkeletonFileExplorer linesCount={1} className="explorer-1" />
          <SkeletonFileExplorer linesCount={3} className="explorer-2" />
        </>
      )

      const verticals = screen.getAllByTestId('layout-vertical')
      expect(verticals[0]).toHaveClass('explorer-1')
      expect(verticals[1]).toHaveClass('explorer-2')
    })
  })

  describe('Keys and Iteration', () => {
    test('should render unique items with keys', () => {
      renderComponent({ linesCount: 5 })
      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(5)
      expect(new Set(horizontals).size).toBe(5)
    })

    test('should handle dynamic linesCount changes', () => {
      const { rerender } = render(<SkeletonFileExplorer linesCount={3} />)

      let horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(3)

      rerender(<SkeletonFileExplorer linesCount={5} />)

      horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(5)
    })
  })

  describe('Integration', () => {
    test('should work within other components', () => {
      render(
        <div data-testid="container">
          <SkeletonFileExplorer linesCount={3} />
        </div>
      )

      const container = screen.getByTestId('container')
      const explorer = screen.getByTestId('layout-vertical')
      expect(container).toContainElement(explorer)
    })

    test('should maintain structure with multiple lines', () => {
      renderComponent({ linesCount: 3 })

      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument()

      const horizontals = screen.getAllByTestId('layout-horizontal')
      expect(horizontals).toHaveLength(3)

      const icons = screen.getAllByTestId('skeleton-icon')
      expect(icons).toHaveLength(3)

      const typographies = screen.getAllByTestId('skeleton-typography')
      expect(typographies).toHaveLength(3)
    })
  })

  describe('Random Width Generation', () => {
    test('should call getRandomPixelWidth with correct range', () => {
      renderComponent({ linesCount: 1 })
      expect(getRandomPixelWidthMock).toHaveBeenCalledWith(30, 120)
    })

    test('should apply random width to each typography', () => {
      renderComponent({ linesCount: 3 })

      const typographies = screen.getAllByTestId('skeleton-typography')
      typographies.forEach(typo => {
        expect(typo).toHaveStyle({ width: '30px' })
      })
    })
  })

  describe('Layout Props', () => {
    test('should apply correct gap to vertical layout', () => {
      renderComponent()
      expect(screen.getByTestId('layout-vertical')).toHaveAttribute('data-gap', '4xs')
    })

    test('should apply correct gap to all horizontal layouts', () => {
      renderComponent({ linesCount: 5 })
      const horizontals = screen.getAllByTestId('layout-horizontal')

      horizontals.forEach(horizontal => {
        expect(horizontal).toHaveAttribute('data-gap', '2xs')
      })
    })

    test('should apply padding to all horizontal layouts', () => {
      renderComponent({ linesCount: 4 })
      const horizontals = screen.getAllByTestId('layout-horizontal')

      horizontals.forEach(horizontal => {
        expect(horizontal).toHaveClass('p-cn-2xs')
      })
    })
  })

  describe('Icon Size', () => {
    test('should use md size for all icons', () => {
      renderComponent({ linesCount: 5 })
      const icons = screen.getAllByTestId('skeleton-icon')

      icons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', 'md')
      })
    })
  })

  describe('Conditional Class Application', () => {
    test('should apply base class only when linesCount > 1', () => {
      const { rerender } = render(<SkeletonFileExplorer linesCount={1} />)

      let vertical = screen.getByTestId('layout-vertical')
      expect(vertical.className).not.toContain('cn-skeleton-file-explorer')

      rerender(<SkeletonFileExplorer linesCount={2} />)

      vertical = screen.getByTestId('layout-vertical')
      expect(vertical).toHaveClass('cn-skeleton-file-explorer')
    })

    test('should not apply base class for single line even with custom className', () => {
      renderComponent({ linesCount: 1, className: 'custom' })

      const vertical = screen.getByTestId('layout-vertical')
      expect(vertical).toHaveClass('custom')
      expect(vertical.className).not.toContain('cn-skeleton-file-explorer')
    })
  })
})
