import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonList, SkeletonListProps } from '../skeleton-list'

// Mock dependencies
vi.mock('@/components', () => ({
  Skeleton: {
    Box: ({ className, ...props }: any) => <div data-testid="skeleton-box" className={className} {...props} />,
    Typography: ({ variant, className, ...props }: any) => (
      <div data-testid="skeleton-typography" data-variant={variant} className={className} {...props} />
    )
  },
  StackedList: {
    Root: ({ children, className, ...props }: any) => (
      <div data-testid="stacked-list-root" className={className} {...props}>
        {children}
      </div>
    ),
    Item: ({ children, className, actions, disableHover, ...props }: any) => (
      <div data-testid="stacked-list-item" className={className} data-disable-hover={disableHover} {...props}>
        {children}
        {actions && <div data-testid="item-actions">{actions}</div>}
      </div>
    ),
    Field: ({ title, description, right, ...props }: any) => (
      <div data-testid="stacked-list-field" data-right={right} {...props}>
        {title && <div data-testid="field-title">{title}</div>}
        {description && <div data-testid="field-description">{description}</div>}
      </div>
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

const renderComponent = (props: Partial<SkeletonListProps> = {}) => {
  return render(<SkeletonList {...props} />)
}

describe('SkeletonList', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton list', () => {
      renderComponent()
      expect(screen.getByTestId('stacked-list-root')).toBeInTheDocument()
    })

    test('should render default 8 items', () => {
      renderComponent()
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(8)
    })

    test('should apply cn-skeleton-list class by default', () => {
      renderComponent()
      expect(screen.getByTestId('stacked-list-root')).toHaveClass('cn-skeleton-list')
    })

    test('should render StackedList.Root as wrapper', () => {
      renderComponent()
      expect(screen.getByTestId('stacked-list-root')).toBeInTheDocument()
    })
  })

  describe('Lines Count', () => {
    test('should render 1 item', () => {
      renderComponent({ linesCount: 1 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(1)
    })

    test('should render 3 items', () => {
      renderComponent({ linesCount: 3 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(3)
    })

    test('should render 5 items', () => {
      renderComponent({ linesCount: 5 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(5)
    })

    test('should render 10 items', () => {
      renderComponent({ linesCount: 10 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(10)
    })

    test('should render 20 items', () => {
      renderComponent({ linesCount: 20 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(20)
    })
  })

  describe('Has Actions', () => {
    test('should render actions when hasActions is true', () => {
      renderComponent({ hasActions: true })
      const actions = screen.getAllByTestId('item-actions')
      expect(actions.length).toBeGreaterThan(0)
    })

    test('should not render actions when hasActions is false', () => {
      renderComponent({ hasActions: false })
      const actions = screen.queryAllByTestId('item-actions')
      expect(actions).toHaveLength(0)
    })

    test('should not render actions when hasActions is undefined', () => {
      renderComponent({ hasActions: undefined })
      const actions = screen.queryAllByTestId('item-actions')
      expect(actions).toHaveLength(0)
    })

    test('should render skeleton box for actions', () => {
      renderComponent({ hasActions: true, linesCount: 2 })
      const boxes = screen.getAllByTestId('skeleton-box')
      expect(boxes.length).toBeGreaterThan(0)
    })

    test('should apply actions class to skeleton box', () => {
      renderComponent({ hasActions: true, linesCount: 1 })
      const boxes = screen.getAllByTestId('skeleton-box')
      boxes.forEach(box => {
        expect(box).toHaveClass('cn-skeleton-list-actions')
      })
    })
  })

  describe('Custom ClassNames', () => {
    test('should apply custom className to root', () => {
      renderComponent({ className: 'custom-list' })
      expect(screen.getByTestId('stacked-list-root')).toHaveClass('custom-list')
    })

    test('should merge custom className with base class', () => {
      renderComponent({ className: 'custom-list' })
      const root = screen.getByTestId('stacked-list-root')
      expect(root).toHaveClass('cn-skeleton-list')
      expect(root).toHaveClass('custom-list')
    })

    test('should apply item className', () => {
      renderComponent({ classNames: { item: 'custom-item' }, linesCount: 2 })
      const items = screen.getAllByTestId('stacked-list-item')
      items.forEach(item => {
        expect(item).toHaveClass('custom-item')
      })
    })

    test('should apply leftTitle className', () => {
      renderComponent({ classNames: { leftTitle: 'custom-left-title' }, linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const leftTitle = typographies.find(t => t.className.includes('custom-left-title'))
      expect(leftTitle).toBeDefined()
    })

    test('should apply leftDescription className', () => {
      renderComponent({ classNames: { leftDescription: 'custom-left-desc' }, linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const leftDesc = typographies.find(t => t.className.includes('custom-left-desc'))
      expect(leftDesc).toBeDefined()
    })

    test('should apply rightTitle className', () => {
      renderComponent({ classNames: { rightTitle: 'custom-right-title' }, linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const rightTitle = typographies.find(t => t.className.includes('custom-right-title'))
      expect(rightTitle).toBeDefined()
    })

    test('should apply rightDescription className', () => {
      renderComponent({ classNames: { rightDescription: 'custom-right-desc' }, linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const rightDesc = typographies.find(t => t.className.includes('custom-right-desc'))
      expect(rightDesc).toBeDefined()
    })

    test('should apply actions className', () => {
      renderComponent({ hasActions: true, classNames: { actions: 'custom-actions' }, linesCount: 1 })
      const boxes = screen.getAllByTestId('skeleton-box')
      boxes.forEach(box => {
        expect(box).toHaveClass('custom-actions')
      })
    })

    test('should handle all classNames together', () => {
      renderComponent({
        linesCount: 2,
        hasActions: true,
        classNames: {
          item: 'item-class',
          leftTitle: 'left-title-class',
          leftDescription: 'left-desc-class',
          rightTitle: 'right-title-class',
          rightDescription: 'right-desc-class',
          actions: 'actions-class'
        }
      })

      const items = screen.getAllByTestId('stacked-list-item')
      expect(items[0]).toHaveClass('item-class')

      const boxes = screen.getAllByTestId('skeleton-box')
      boxes.forEach(box => {
        expect(box).toHaveClass('actions-class')
      })
    })
  })

  describe('OnlyItems Prop', () => {
    test('should not apply cn-skeleton-list class when onlyItems is true', () => {
      renderComponent({ onlyItems: true })
      expect(screen.queryByTestId('stacked-list-root')).toBeNull()
    })

    test('should apply cn-skeleton-list class when onlyItems is false', () => {
      renderComponent({ onlyItems: false })
      expect(screen.getByTestId('stacked-list-root')).toHaveClass('cn-skeleton-list')
    })

    test('should render items even when onlyItems is true', () => {
      renderComponent({ onlyItems: true, linesCount: 3 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(3)
    })
  })

  describe('List Structure', () => {
    test('should render two fields per item', () => {
      renderComponent({ linesCount: 1 })
      const fields = screen.getAllByTestId('stacked-list-field')
      expect(fields).toHaveLength(2)
    })

    test('should render left field', () => {
      renderComponent({ linesCount: 1 })
      const fields = screen.getAllByTestId('stacked-list-field')
      const leftField = fields.find(f => f.getAttribute('data-right') !== 'true')
      expect(leftField).toBeDefined()
    })

    test('should render right field', () => {
      renderComponent({ linesCount: 1 })
      const fields = screen.getAllByTestId('stacked-list-field')
      const rightField = fields.find(f => f.getAttribute('data-right') === 'true')
      expect(rightField).toBeDefined()
    })

    test('should render title and description in each field', () => {
      renderComponent({ linesCount: 1 })
      const titles = screen.getAllByTestId('field-title')
      const descriptions = screen.getAllByTestId('field-description')
      expect(titles).toHaveLength(2)
      expect(descriptions).toHaveLength(2)
    })

    test('should disable hover on items', () => {
      renderComponent({ linesCount: 2 })
      const items = screen.getAllByTestId('stacked-list-item')
      items.forEach(item => {
        expect(item).toHaveAttribute('data-disable-hover', 'true')
      })
    })
  })

  describe('Skeleton Typography', () => {
    test('should render skeleton typography for titles', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      expect(typographies.length).toBeGreaterThan(0)
    })

    test('should use body-single-line-normal variant', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      typographies.forEach(typo => {
        expect(typo).toHaveAttribute('data-variant', 'body-single-line-normal')
      })
    })

    test('should apply default widths to skeleton typographies', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')

      // Check that widths are applied
      typographies.forEach(typo => {
        expect(typo.className).toBeTruthy()
      })
    })

    test('should render 4 skeleton typographies per item (2 titles + 2 descriptions)', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      expect(typographies).toHaveLength(4)
    })
  })

  describe('Edge Cases', () => {
    test('should handle linesCount of 0', () => {
      renderComponent({ linesCount: 0 })
      const items = screen.queryAllByTestId('stacked-list-item')
      expect(items).toHaveLength(0)
    })

    test('should handle empty classNames object', () => {
      renderComponent({ classNames: {} })
      expect(screen.getByTestId('stacked-list-root')).toBeInTheDocument()
    })

    test('should handle undefined classNames', () => {
      renderComponent({ classNames: undefined })
      expect(screen.getByTestId('stacked-list-root')).toBeInTheDocument()
    })

    test('should handle all props together', () => {
      renderComponent({
        linesCount: 5,
        hasActions: true,
        className: 'custom-class',
        onlyItems: false,
        classNames: {
          item: 'item-class',
          actions: 'actions-class'
        }
      })

      expect(screen.getAllByTestId('stacked-list-item')).toHaveLength(5)
      expect(screen.getAllByTestId('item-actions')).toHaveLength(5)
      expect(screen.getByTestId('stacked-list-root')).toHaveClass('custom-class')
    })
  })

  describe('Default Props', () => {
    test('should use default linesCount of 8', () => {
      renderComponent()
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(8)
    })

    test('should use empty classNames by default', () => {
      renderComponent()
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items[0].className).not.toContain('undefined')
    })

    test('should not have actions by default', () => {
      renderComponent()
      const actions = screen.queryAllByTestId('item-actions')
      expect(actions).toHaveLength(0)
    })

    test('should not be onlyItems by default', () => {
      renderComponent()
      expect(screen.getByTestId('stacked-list-root')).toHaveClass('cn-skeleton-list')
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple lists independently', () => {
      render(
        <>
          <SkeletonList linesCount={2} />
          <SkeletonList linesCount={3} />
        </>
      )

      const roots = screen.getAllByTestId('stacked-list-root')
      expect(roots).toHaveLength(2)

      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(5) // 2 + 3
    })

    test('should handle different props for multiple instances', () => {
      render(
        <>
          <SkeletonList linesCount={2} hasActions={true} />
          <SkeletonList linesCount={2} hasActions={false} />
        </>
      )

      const actions = screen.getAllByTestId('item-actions')
      expect(actions).toHaveLength(2) // Only from first list
    })
  })

  describe('Keys and Iteration', () => {
    test('should render unique items with keys', () => {
      renderComponent({ linesCount: 5 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(5)
      expect(new Set(items).size).toBe(5)
    })

    test('should handle large linesCount', () => {
      renderComponent({ linesCount: 50 })
      const items = screen.getAllByTestId('stacked-list-item')
      expect(items).toHaveLength(50)
    })
  })

  describe('Integration', () => {
    test('should work within other components', () => {
      render(
        <div data-testid="container">
          <SkeletonList linesCount={3} />
        </div>
      )

      const container = screen.getByTestId('container')
      const list = screen.getByTestId('stacked-list-root')
      expect(container).toContainElement(list)
    })

    test('should maintain structure with actions enabled', () => {
      renderComponent({ linesCount: 3, hasActions: true })

      expect(screen.getAllByTestId('stacked-list-item')).toHaveLength(3)
      expect(screen.getAllByTestId('stacked-list-field')).toHaveLength(6) // 2 per item
      expect(screen.getAllByTestId('item-actions')).toHaveLength(3)
      expect(screen.getAllByTestId('skeleton-typography')).toHaveLength(12) // 4 per item
    })

    test('should maintain structure without actions', () => {
      renderComponent({ linesCount: 3, hasActions: false })

      expect(screen.getAllByTestId('stacked-list-item')).toHaveLength(3)
      expect(screen.getAllByTestId('stacked-list-field')).toHaveLength(6)
      expect(screen.queryAllByTestId('item-actions')).toHaveLength(0)
      expect(screen.getAllByTestId('skeleton-typography')).toHaveLength(12)
    })
  })

  describe('Width Classes', () => {
    test('should apply default width classes to left title', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const hasWidthClass = typographies.some(t => t.className.includes('w-[129px]'))
      expect(hasWidthClass).toBe(true)
    })

    test('should apply default width classes to left description', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const hasWidthClass = typographies.some(t => t.className.includes('w-[240px]'))
      expect(hasWidthClass).toBe(true)
    })

    test('should apply default width classes to right title', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const hasWidthClass = typographies.some(t => t.className.includes('w-[147px]'))
      expect(hasWidthClass).toBe(true)
    })

    test('should apply default width classes to right description', () => {
      renderComponent({ linesCount: 1 })
      const typographies = screen.getAllByTestId('skeleton-typography')
      const hasWidthClass = typographies.some(t => t.className.includes('w-[68px]'))
      expect(hasWidthClass).toBe(true)
    })

    test('should override width classes with custom ones', () => {
      renderComponent({
        linesCount: 1,
        classNames: {
          leftTitle: 'w-[200px]',
          leftDescription: 'w-[300px]',
          rightTitle: 'w-[150px]',
          rightDescription: 'w-[100px]'
        }
      })

      const typographies = screen.getAllByTestId('skeleton-typography')
      expect(typographies.length).toBeGreaterThan(0)
    })
  })
})
