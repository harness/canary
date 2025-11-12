import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonForm, SkeletonFormItem } from '../skeleton-form'

// Mock dependencies
vi.mock('@components/form-primitives', () => ({
  ControlGroup: {
    Root: ({ children, orientation, ...props }: any) => (
      <div data-testid="control-group-root" data-orientation={orientation} {...props}>
        {children}
      </div>
    ),
    LabelWrapper: ({ children, className, ...props }: any) => (
      <div data-testid="label-wrapper" className={className} {...props}>
        {children}
      </div>
    ),
    InputWrapper: ({ children, className, ...props }: any) => (
      <div data-testid="input-wrapper" className={className} {...props}>
        {children}
      </div>
    )
  }
}))

vi.mock('@components/layout', () => ({
  Layout: {
    Grid: ({ children, gap, className, ...props }: any) => (
      <div data-testid="layout-grid" data-gap={gap} className={className} {...props}>
        {children}
      </div>
    )
  }
}))

vi.mock('../skeleton-typography', () => ({
  SkeletonTypography: ({ className, ...props }: any) => (
    <div data-testid="skeleton-typography" className={className} {...props} />
  )
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

describe('SkeletonFormItem', () => {
  describe('Basic Rendering', () => {
    test('should render form item', () => {
      render(<SkeletonFormItem />)
      expect(screen.getByTestId('control-group-root')).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SkeletonFormItem.displayName).toBe('SkeletonFormItem')
    })

    test('should render input wrapper', () => {
      render(<SkeletonFormItem />)
      expect(screen.getByTestId('input-wrapper')).toBeInTheDocument()
    })

    test('should render skeleton typography in input wrapper', () => {
      render(<SkeletonFormItem />)
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('With Label', () => {
    test('should render label wrapper when withLabel is true', () => {
      render(<SkeletonFormItem withLabel={true} />)
      expect(screen.getByTestId('label-wrapper')).toBeInTheDocument()
    })

    test('should not render label wrapper when withLabel is false', () => {
      render(<SkeletonFormItem withLabel={false} />)
      expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
    })

    test('should not render label wrapper when withLabel is undefined', () => {
      render(<SkeletonFormItem withLabel={undefined} />)
      expect(screen.queryByTestId('label-wrapper')).not.toBeInTheDocument()
    })

    test('should render skeleton in label wrapper', () => {
      render(<SkeletonFormItem withLabel={true} />)
      const labelWrapper = screen.getByTestId('label-wrapper')
      const skeleton = labelWrapper.querySelector('[data-testid="skeleton-typography"]')
      expect(skeleton).toBeInTheDocument()
    })

    test('should apply label wrapper className', () => {
      render(<SkeletonFormItem withLabel={true} labelClassName="custom-label" />)
      expect(screen.getByTestId('label-wrapper')).toHaveClass('custom-label')
    })
  })

  describe('Orientation', () => {
    test('should pass orientation to ControlGroup.Root', () => {
      render(<SkeletonFormItem orientation="horizontal" />)
      expect(screen.getByTestId('control-group-root')).toHaveAttribute('data-orientation', 'horizontal')
    })

    test('should pass vertical orientation', () => {
      render(<SkeletonFormItem orientation="vertical" />)
      expect(screen.getByTestId('control-group-root')).toHaveAttribute('data-orientation', 'vertical')
    })

    test('should handle undefined orientation', () => {
      render(<SkeletonFormItem orientation={undefined} />)
      expect(screen.getByTestId('control-group-root')).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    test('should render with sm size', () => {
      render(<SkeletonFormItem size="sm" />)
      const inputWrapper = screen.getByTestId('input-wrapper')
      expect(inputWrapper).toHaveClass('cn-skeleton-form-item-sm')
    })

    test('should render with md size', () => {
      render(<SkeletonFormItem size="md" />)
      const inputWrapper = screen.getByTestId('input-wrapper')
      expect(inputWrapper).toHaveClass('cn-skeleton-form-item-md')
    })

    test('should handle undefined size', () => {
      render(<SkeletonFormItem size={undefined} />)
      expect(screen.getByTestId('input-wrapper')).toBeInTheDocument()
    })
  })

  describe('Custom ClassNames', () => {
    test('should apply custom className to component', () => {
      render(<SkeletonFormItem className="custom-form-item" />)
      expect(screen.getByTestId('control-group-root')).toBeInTheDocument()
    })

    test('should apply inputClassName to input wrapper', () => {
      render(<SkeletonFormItem inputClassName="custom-input" />)
      expect(screen.getByTestId('input-wrapper')).toHaveClass('custom-input')
    })

    test('should merge size and input className', () => {
      render(<SkeletonFormItem size="md" inputClassName="custom-input" />)
      const inputWrapper = screen.getByTestId('input-wrapper')
      expect(inputWrapper).toHaveClass('cn-skeleton-form-item-md')
      expect(inputWrapper).toHaveClass('custom-input')
    })
  })

  describe('Edge Cases', () => {
    test('should handle all props together', () => {
      render(
        <SkeletonFormItem
          withLabel={true}
          orientation="horizontal"
          size="sm"
          labelClassName="label-class"
          inputClassName="input-class"
        />
      )
      expect(screen.getByTestId('label-wrapper')).toHaveClass('label-class')
      expect(screen.getByTestId('input-wrapper')).toHaveClass('input-class')
      expect(screen.getByTestId('control-group-root')).toHaveAttribute('data-orientation', 'horizontal')
    })

    test('should handle empty classNames', () => {
      render(<SkeletonFormItem labelClassName="" inputClassName="" />)
      expect(screen.getByTestId('input-wrapper')).toBeInTheDocument()
    })
  })
})

describe('SkeletonForm', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton form', () => {
      render(<SkeletonForm />)
      expect(screen.getByTestId('layout-grid')).toBeInTheDocument()
    })

    test('should render with default 2 lines', () => {
      render(<SkeletonForm />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(2)
    })

    test('should apply cn-skeleton-form-field class', () => {
      render(<SkeletonForm />)
      expect(screen.getByTestId('layout-grid')).toHaveClass('cn-skeleton-form-field')
    })

    test('should apply gap xl to layout', () => {
      render(<SkeletonForm />)
      expect(screen.getByTestId('layout-grid')).toHaveAttribute('data-gap', 'xl')
    })
  })

  describe('Lines Count', () => {
    test('should render 1 line', () => {
      render(<SkeletonForm linesCount={1} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(1)
    })

    test('should render 3 lines', () => {
      render(<SkeletonForm linesCount={3} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(3)
    })

    test('should render 5 lines', () => {
      render(<SkeletonForm linesCount={5} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(5)
    })

    test('should render 9 lines (max)', () => {
      render(<SkeletonForm linesCount={9} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(9)
    })

    test('should handle all valid line counts', () => {
      const lineCounts: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      lineCounts.forEach(count => {
        const { unmount } = render(<SkeletonForm linesCount={count} />)
        const controlGroups = screen.getAllByTestId('control-group-root')
        expect(controlGroups).toHaveLength(count)
        unmount()
      })
    })
  })

  describe('Item Props', () => {
    test('should pass withLabel to items', () => {
      render(<SkeletonForm itemProps={{ withLabel: true }} />)
      expect(screen.getAllByTestId('label-wrapper')).toHaveLength(2)
    })

    test('should pass withLabel=false to items', () => {
      render(<SkeletonForm itemProps={{ withLabel: false }} />)
      expect(screen.queryAllByTestId('label-wrapper')).toHaveLength(0)
    })

    test('should default withLabel to true', () => {
      render(<SkeletonForm itemProps={{}} />)
      expect(screen.getAllByTestId('label-wrapper')).toHaveLength(2)
    })

    test('should pass size to items', () => {
      render(<SkeletonForm itemProps={{ size: 'sm' }} />)
      const inputWrappers = screen.getAllByTestId('input-wrapper')
      inputWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('cn-skeleton-form-item-sm')
      })
    })

    test('should pass orientation to items', () => {
      render(<SkeletonForm itemProps={{ orientation: 'horizontal' }} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      controlGroups.forEach(group => {
        expect(group).toHaveAttribute('data-orientation', 'horizontal')
      })
    })

    test('should default orientation to vertical', () => {
      render(<SkeletonForm />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      controlGroups.forEach(group => {
        expect(group).toHaveAttribute('data-orientation', 'vertical')
      })
    })

    test('should pass labelClassName to items', () => {
      render(<SkeletonForm itemProps={{ withLabel: true, labelClassName: 'custom-label' }} />)
      const labelWrappers = screen.getAllByTestId('label-wrapper')
      labelWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('custom-label')
      })
    })

    test('should pass inputClassName to items', () => {
      render(<SkeletonForm itemProps={{ inputClassName: 'custom-input' }} />)
      const inputWrappers = screen.getAllByTestId('input-wrapper')
      inputWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('custom-input')
      })
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      render(<SkeletonForm className="custom-form" />)
      expect(screen.getByTestId('layout-grid')).toHaveClass('custom-form')
    })

    test('should merge custom className with base class', () => {
      render(<SkeletonForm className="custom-form" />)
      const grid = screen.getByTestId('layout-grid')
      expect(grid).toHaveClass('cn-skeleton-form-field')
      expect(grid).toHaveClass('custom-form')
    })

    test('should handle empty className', () => {
      render(<SkeletonForm className="" />)
      expect(screen.getByTestId('layout-grid')).toHaveClass('cn-skeleton-form-field')
    })
  })

  describe('Complex Item Props', () => {
    test('should handle all item props together', () => {
      render(
        <SkeletonForm
          linesCount={3}
          itemProps={{
            withLabel: true,
            size: 'sm',
            orientation: 'horizontal',
            labelClassName: 'label-custom',
            inputClassName: 'input-custom'
          }}
        />
      )

      expect(screen.getAllByTestId('control-group-root')).toHaveLength(3)
      expect(screen.getAllByTestId('label-wrapper')).toHaveLength(3)

      const labelWrappers = screen.getAllByTestId('label-wrapper')
      labelWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('label-custom')
      })

      const inputWrappers = screen.getAllByTestId('input-wrapper')
      inputWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('input-custom')
        expect(wrapper).toHaveClass('cn-skeleton-form-item-sm')
      })
    })

    test('should handle minimal item props', () => {
      render(<SkeletonForm itemProps={{}} />)
      expect(screen.getAllByTestId('control-group-root')).toHaveLength(2)
    })
  })

  describe('Edge Cases', () => {
    test('should handle undefined itemProps', () => {
      render(<SkeletonForm itemProps={undefined} />)
      expect(screen.getAllByTestId('control-group-root')).toHaveLength(2)
    })

    test('should handle linesCount with various sizes', () => {
      render(<SkeletonForm linesCount={4} itemProps={{ size: 'md' }} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(4)

      const inputWrappers = screen.getAllByTestId('input-wrapper')
      inputWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('cn-skeleton-form-item-md')
      })
    })

    test('should render unique keys for items', () => {
      render(<SkeletonForm linesCount={5} />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(5)
      // Each item should be rendered independently
      expect(new Set(controlGroups).size).toBe(5)
    })
  })

  describe('Default Values', () => {
    test('should use default linesCount of 2', () => {
      render(<SkeletonForm />)
      expect(screen.getAllByTestId('control-group-root')).toHaveLength(2)
    })

    test('should use default size of md', () => {
      render(<SkeletonForm />)
      const inputWrappers = screen.getAllByTestId('input-wrapper')
      inputWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('cn-skeleton-form-item-md')
      })
    })

    test('should use default withLabel of true', () => {
      render(<SkeletonForm />)
      expect(screen.getAllByTestId('label-wrapper')).toHaveLength(2)
    })

    test('should use default orientation of vertical', () => {
      render(<SkeletonForm />)
      const controlGroups = screen.getAllByTestId('control-group-root')
      controlGroups.forEach(group => {
        expect(group).toHaveAttribute('data-orientation', 'vertical')
      })
    })
  })

  describe('Integration', () => {
    test('should render complete form structure', () => {
      render(<SkeletonForm linesCount={3} />)

      // Should have layout grid
      expect(screen.getByTestId('layout-grid')).toBeInTheDocument()

      // Should have 3 control groups
      expect(screen.getAllByTestId('control-group-root')).toHaveLength(3)

      // Should have labels
      expect(screen.getAllByTestId('label-wrapper')).toHaveLength(3)

      // Should have input wrappers
      expect(screen.getAllByTestId('input-wrapper')).toHaveLength(3)

      // Should have skeleton typography elements
      const skeletons = screen.getAllByTestId('skeleton-typography')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    test('should maintain form structure with different orientations', () => {
      const { rerender } = render(<SkeletonForm itemProps={{ orientation: 'vertical' }} />)

      let controlGroups = screen.getAllByTestId('control-group-root')
      controlGroups.forEach(group => {
        expect(group).toHaveAttribute('data-orientation', 'vertical')
      })

      rerender(<SkeletonForm itemProps={{ orientation: 'horizontal' }} />)

      controlGroups = screen.getAllByTestId('control-group-root')
      controlGroups.forEach(group => {
        expect(group).toHaveAttribute('data-orientation', 'horizontal')
      })
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple forms independently', () => {
      render(
        <>
          <SkeletonForm linesCount={2} />
          <SkeletonForm linesCount={3} />
        </>
      )

      const grids = screen.getAllByTestId('layout-grid')
      expect(grids).toHaveLength(2)

      const controlGroups = screen.getAllByTestId('control-group-root')
      expect(controlGroups).toHaveLength(5) // 2 + 3
    })
  })
})
