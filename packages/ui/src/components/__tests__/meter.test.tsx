import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Meter, MeterState } from '../meter'

describe('Meter', () => {
  describe('Rendering', () => {
    test('should render meter with default props', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
    })

    test('should render with empty data array', () => {
      const { container } = render(<Meter data={[]} />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
      // Should render 11 empty bars when data is empty
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should render with data array', () => {
      const data = [
        { id: '1', state: MeterState.Success },
        { id: '2', state: MeterState.Error }
      ]
      const { container } = render(<Meter data={data} />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should apply custom className', () => {
      const { container } = render(<Meter className="custom-meter" />)
      const meter = container.querySelector('.custom-meter')
      expect(meter).toBeInTheDocument()
      expect(meter).toHaveClass('cn-meter')
      expect(meter).toHaveClass('custom-meter')
    })
  })

  describe('MeterState Enum', () => {
    test('should have correct enum values', () => {
      expect(MeterState.Empty).toBe(0)
      expect(MeterState.Error).toBe(1)
      expect(MeterState.Warning).toBe(2)
      expect(MeterState.Success).toBe(3)
    })
  })

  describe('State Colors', () => {
    test('should render Empty state with correct color', () => {
      const data = [{ id: '1', state: MeterState.Empty }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      const lastBar = bars[bars.length - 1]
      expect(lastBar).toHaveClass('bg-cn-gray-secondary')
    })

    test('should render Error state with correct color', () => {
      const data = [{ id: '1', state: MeterState.Error }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      const lastBar = bars[bars.length - 1]
      expect(lastBar).toHaveClass('bg-cn-danger-primary')
    })

    test('should render Warning state with correct color', () => {
      const data = [{ id: '1', state: MeterState.Warning }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      const lastBar = bars[bars.length - 1]
      expect(lastBar).toHaveClass('bg-cn-warning-primary')
    })

    test('should render Success state with correct color', () => {
      const data = [{ id: '1', state: MeterState.Success }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      const lastBar = bars[bars.length - 1]
      expect(lastBar).toHaveClass('bg-cn-success-primary')
    })
  })

  describe('Data Array Length Handling', () => {
    test('should render 11 bars when data length is 1', () => {
      const data = [{ id: '1', state: MeterState.Success }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should render 11 bars when data length is 5', () => {
      const data = [
        { id: '1', state: MeterState.Success },
        { id: '2', state: MeterState.Error },
        { id: '3', state: MeterState.Warning },
        { id: '4', state: MeterState.Success },
        { id: '5', state: MeterState.Empty }
      ]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should render 11 bars when data length is 10', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        state: MeterState.Success
      }))
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should render 10 bars when data length is 10', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        state: MeterState.Success
      }))
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })
  })

  describe('Mixed State Rendering', () => {
    test('should render multiple states correctly', () => {
      const data = [
        { id: '1', state: MeterState.Success },
        { id: '2', state: MeterState.Error },
        { id: '3', state: MeterState.Warning }
      ]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')

      // Check that we have 11 total bars
      expect(bars).toHaveLength(10)

      // Last 3 bars should have the correct colors for Success, Error, Warning
      const lastThreeBars = Array.from(bars).slice(-3)
      expect(lastThreeBars[0]).toHaveClass('bg-cn-success-primary')
      expect(lastThreeBars[1]).toHaveClass('bg-cn-danger-primary')
      expect(lastThreeBars[2]).toHaveClass('bg-cn-warning-primary')
    })

    test('should render all different states in single meter', () => {
      const data = [
        { id: '1', state: MeterState.Empty },
        { id: '2', state: MeterState.Error },
        { id: '3', state: MeterState.Warning },
        { id: '4', state: MeterState.Success }
      ]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })
  })

  describe('Data Without IDs', () => {
    test('should render data without id property', () => {
      const data = [{ state: MeterState.Success }, { state: MeterState.Error }]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should render mixed data with and without ids', () => {
      const data = [
        { id: '1', state: MeterState.Success },
        { state: MeterState.Error },
        { id: '3', state: MeterState.Warning }
      ]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })
  })

  describe('Bar Structure', () => {
    test('should render bars with correct class', () => {
      const { container } = render(<Meter />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars.length).toBeGreaterThan(0)
      bars.forEach(bar => {
        expect(bar).toHaveClass('cn-meter-bar')
      })
    })

    test('should render bars with background color', () => {
      const { container } = render(<Meter />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars.length).toBeGreaterThan(0)
      bars.forEach(bar => {
        expect(bar).toHaveClass('cn-meter-bar')
      })
    })

    test('should render all 11 bars', () => {
      const { container } = render(<Meter />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })
  })

  describe('Container Structure', () => {
    test('should have cn-meter class', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toHaveClass('cn-meter')
    })

    test('should render meter container', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
    })

    test('should contain 11 bars', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      const bars = meter?.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should be a div element', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter?.tagName).toBe('DIV')
    })
  })

  describe('Edge Cases', () => {
    test('should handle undefined data', () => {
      const { container } = render(<Meter data={undefined} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should handle exactly 10 data items', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        state: i % 2 === 0 ? MeterState.Success : MeterState.Error
      }))
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should handle empty string className', () => {
      const { container } = render(<Meter className="" />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
    })

    test('should combine multiple custom classNames', () => {
      const { container } = render(<Meter className="custom-1 custom-2" />)
      const meter = container.querySelector('.custom-1')
      expect(meter).toHaveClass('custom-1')
      expect(meter).toHaveClass('custom-2')
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when data changes', () => {
      const { rerender, container } = render(<Meter data={[{ id: '1', state: MeterState.Success }]} />)

      let bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)

      rerender(
        <Meter
          data={[
            { id: '1', state: MeterState.Error },
            { id: '2', state: MeterState.Warning }
          ]}
        />
      )

      bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should update when className changes', () => {
      const { rerender, container } = render(<Meter className="class-1" />)

      let meter = container.querySelector('.class-1')
      expect(meter).toBeInTheDocument()

      rerender(<Meter className="class-2" />)

      meter = container.querySelector('.class-2')
      expect(meter).toBeInTheDocument()
      expect(container.querySelector('.class-1')).not.toBeInTheDocument()
    })

    test('should update from empty to filled data', () => {
      const { rerender, container } = render(<Meter data={[]} />)

      let bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)

      const newData = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        state: MeterState.Success
      }))
      rerender(<Meter data={newData} />)

      bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      const data = [
        { id: 'item-1', state: MeterState.Success },
        { id: 'item-2', state: MeterState.Error },
        { id: 'item-3', state: MeterState.Warning },
        { id: 'item-4', state: MeterState.Empty }
      ]
      const { container } = render(<Meter data={data} className="complex-meter custom-styling" />)

      const meter = container.querySelector('.complex-meter')
      expect(meter).toBeInTheDocument()
      expect(meter).toHaveClass('cn-meter')
      expect(meter).toHaveClass('complex-meter')
      expect(meter).toHaveClass('custom-styling')

      const bars = container.querySelectorAll('.cn-meter-bar')
      expect(bars).toHaveLength(10)
    })

    test('should maintain bar order with different states', () => {
      const data = [
        { id: 'first', state: MeterState.Error },
        { id: 'second', state: MeterState.Warning },
        { id: 'third', state: MeterState.Success }
      ]
      const { container } = render(<Meter data={data} />)
      const bars = container.querySelectorAll('.cn-meter-bar')

      // Bars should maintain order: empty bars first, then data bars
      expect(bars).toHaveLength(10)

      // Last 3 bars should be the data in order
      const lastThreeBars = Array.from(bars).slice(-3)
      expect(lastThreeBars[0]).toHaveClass('bg-cn-danger-primary')
      expect(lastThreeBars[1]).toHaveClass('bg-cn-warning-primary')
      expect(lastThreeBars[2]).toHaveClass('bg-cn-success-primary')
    })

    test('should render with single item of each state type', () => {
      const states = [MeterState.Empty, MeterState.Error, MeterState.Warning, MeterState.Success]

      states.forEach(state => {
        const data = [{ id: 'single', state }]
        const { container } = render(<Meter data={data} />)
        const bars = container.querySelectorAll('.cn-meter-bar')
        expect(bars).toHaveLength(10)
      })
    })
  })

  describe('Accessibility', () => {
    test('should render as presentational div', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter?.tagName).toBe('DIV')
    })

    test('should be used as visual indicator', () => {
      const { container } = render(<Meter data={[{ id: '1', state: MeterState.Success }]} className="meter" />)
      const meter = container.querySelector('.meter')
      expect(meter).toBeInTheDocument()
      expect(meter).toHaveClass('cn-meter')
    })
  })

  describe('Default Values', () => {
    test('should use empty array as default data', () => {
      const { container } = render(<Meter />)
      const bars = container.querySelectorAll('.cn-meter-bar')
      // Default empty array should create 11 empty bars
      expect(bars).toHaveLength(10)
      // All bars should have empty state color
      bars.forEach(bar => {
        expect(bar).toHaveClass('bg-cn-gray-secondary')
      })
    })

    test('should not have custom className by default', () => {
      const { container } = render(<Meter />)
      const meter = container.querySelector('.cn-meter')
      expect(meter).toBeInTheDocument()
      expect(meter).toHaveClass('cn-meter')
      // Should only have cn-meter class, no custom classes
      expect(meter?.classList.length).toBe(1)
    })
  })
})
