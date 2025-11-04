import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ButtonLayout } from '../button-layout'

const renderComponent = (props: Partial<React.ComponentProps<typeof ButtonLayout>> = {}): RenderResult => {
  return render(
    <ButtonLayout {...props}>
      <div>Content</div>
    </ButtonLayout>
  )
}

describe('ButtonLayout', () => {
  describe('ButtonLayout Root', () => {
    test('should render with default horizontal orientation', () => {
      const { container } = renderComponent()

      const layout = container.querySelector('.cn-button-layout-horizontal')
      expect(layout).toBeInTheDocument()
    })

    test('should render with vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const layout = container.querySelector('.cn-button-layout-vertical')
      expect(layout).toBeInTheDocument()
    })

    test('should render with default end alignment', () => {
      const { container } = renderComponent()

      const layout = container.querySelector('.cn-button-layout-horizontal-end')
      expect(layout).toBeInTheDocument()
    })

    test('should render with start alignment', () => {
      const { container } = renderComponent({ horizontalAlign: 'start' })

      const layout = container.querySelector('.cn-button-layout-horizontal-start')
      expect(layout).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-layout' })

      const layout = container.querySelector('.custom-layout')
      expect(layout).toBeInTheDocument()
    })

    test('should render children', () => {
      renderComponent()

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should pass through HTML div attributes', () => {
      const { container } = render(
        <ButtonLayout data-testid="layout" id="test-layout">
          <div>Content</div>
        </ButtonLayout>
      )

      const layout = container.querySelector('#test-layout')
      expect(layout).toBeInTheDocument()
      expect(screen.getByTestId('layout')).toBeInTheDocument()
    })
  })

  describe('ButtonLayout.Root', () => {
    test('should render Root component', () => {
      const { container } = render(
        <ButtonLayout.Root>
          <div>Root Content</div>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toBeInTheDocument()
      expect(screen.getByText('Root Content')).toBeInTheDocument()
    })

    test('should apply orientation to Root', () => {
      const { container } = render(
        <ButtonLayout.Root orientation="vertical">
          <div>Content</div>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout-vertical')
      expect(layout).toBeInTheDocument()
    })

    test('should apply horizontal alignment to Root', () => {
      const { container } = render(
        <ButtonLayout.Root horizontalAlign="start">
          <div>Content</div>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout-horizontal-start')
      expect(layout).toBeInTheDocument()
    })
  })

  describe('ButtonLayout.Primary', () => {
    test('should render Primary component', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Primary Action</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const primary = container.querySelector('.cn-button-layout-primary')
      expect(primary).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument()
    })

    test('should apply custom className to Primary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary className="custom-primary">
            <button>Action</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const primary = container.querySelector('.custom-primary')
      expect(primary).toBeInTheDocument()
    })

    test('should forward ref on Primary', () => {
      const ref = vi.fn()

      render(
        <ButtonLayout>
          <ButtonLayout.Primary ref={ref}>
            <button>Action</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should pass through HTML attributes to Primary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary data-testid="primary" id="primary-id">
            <button>Action</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByTestId('primary')).toBeInTheDocument()
      expect(container.querySelector('#primary-id')).toBeInTheDocument()
    })
  })

  describe('ButtonLayout.Secondary', () => {
    test('should render Secondary component', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <button>Secondary Action</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const secondary = container.querySelector('.cn-button-layout-secondary')
      expect(secondary).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument()
    })

    test('should apply custom className to Secondary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Secondary className="custom-secondary">
            <button>Action</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const secondary = container.querySelector('.custom-secondary')
      expect(secondary).toBeInTheDocument()
    })

    test('should forward ref on Secondary', () => {
      const ref = vi.fn()

      render(
        <ButtonLayout>
          <ButtonLayout.Secondary ref={ref}>
            <button>Action</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should pass through HTML attributes to Secondary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Secondary data-testid="secondary" id="secondary-id">
            <button>Action</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByTestId('secondary')).toBeInTheDocument()
      expect(container.querySelector('#secondary-id')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete layout with Primary and Secondary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Save</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <button>Cancel</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(container.querySelector('.cn-button-layout-primary')).toBeInTheDocument()
      expect(container.querySelector('.cn-button-layout-secondary')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should render vertical layout with Primary and Secondary', () => {
      const { container } = render(
        <ButtonLayout orientation="vertical">
          <ButtonLayout.Primary>
            <button>Primary</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <button>Secondary</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout-vertical')
      expect(layout).toBeInTheDocument()
    })

    test('should render start-aligned layout', () => {
      const { container } = render(
        <ButtonLayout horizontalAlign="start">
          <ButtonLayout.Primary>
            <button>Action</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout-horizontal-start')
      expect(layout).toBeInTheDocument()
    })

    test('should render multiple buttons in Primary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Action 1</button>
            <button>Action 2</button>
            <button>Action 3</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 3' })).toBeInTheDocument()
    })

    test('should render multiple buttons in Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <button>Cancel</button>
            <button>Reset</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })

    test('should combine all props', () => {
      const { container } = render(
        <ButtonLayout orientation="vertical" horizontalAlign="start" className="custom-layout">
          <ButtonLayout.Primary className="custom-primary">
            <button>Primary</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary className="custom-secondary">
            <button>Secondary</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(container.querySelector('.cn-button-layout-vertical')).toBeInTheDocument()
      expect(container.querySelector('.custom-layout')).toBeInTheDocument()
      expect(container.querySelector('.custom-primary')).toBeInTheDocument()
      expect(container.querySelector('.custom-secondary')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should render with only Primary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Only Primary</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Only Primary' })).toBeInTheDocument()
    })

    test('should render with only Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <button>Only Secondary</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Only Secondary' })).toBeInTheDocument()
    })

    test('should render with no Primary or Secondary wrappers', () => {
      render(
        <ButtonLayout>
          <button>Direct Button</button>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Direct Button' })).toBeInTheDocument()
    })

    test('should handle empty children', () => {
      const { container } = render(<ButtonLayout>{null}</ButtonLayout>)

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toBeInTheDocument()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct displayName for Root', () => {
      expect(ButtonLayout.Root.displayName).toBe('ButtonLayoutRoot')
    })

    test('should have correct displayName for Primary', () => {
      expect(ButtonLayout.Primary.displayName).toBe('ButtonLayoutPrimary')
    })

    test('should have correct displayName for Secondary', () => {
      expect(ButtonLayout.Secondary.displayName).toBe('ButtonLayoutSecondary')
    })
  })

  describe('Default Values', () => {
    test('should use default horizontal orientation', () => {
      const { container } = render(
        <ButtonLayout>
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout-horizontal')
      expect(layout).toBeInTheDocument()
    })

    test('should use default end alignment', () => {
      const { container } = render(
        <ButtonLayout>
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout-horizontal-end')
      expect(layout).toBeInTheDocument()
    })

    test('should apply default variants when props not specified', () => {
      const { container } = render(
        <ButtonLayout.Root>
          <button>Test</button>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal')
      expect(layout).toHaveClass('cn-button-layout-horizontal-end')
    })
  })

  describe('All Orientation and Alignment Combinations', () => {
    test('should render horizontal with start alignment', () => {
      const { container } = render(
        <ButtonLayout orientation="horizontal" horizontalAlign="start">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')
    })

    test('should render horizontal with end alignment', () => {
      const { container } = render(
        <ButtonLayout orientation="horizontal" horizontalAlign="end">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal')
      expect(layout).toHaveClass('cn-button-layout-horizontal-end')
    })

    test('should render vertical with start alignment', () => {
      const { container } = render(
        <ButtonLayout orientation="vertical" horizontalAlign="start">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')
    })

    test('should render vertical with end alignment', () => {
      const { container } = render(
        <ButtonLayout orientation="vertical" horizontalAlign="end">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).toHaveClass('cn-button-layout-horizontal-end')
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when orientation changes', () => {
      const { rerender, container } = render(
        <ButtonLayout orientation="horizontal">
          <button>Test</button>
        </ButtonLayout>
      )

      let layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal')

      rerender(
        <ButtonLayout orientation="vertical">
          <button>Test</button>
        </ButtonLayout>
      )

      layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).not.toHaveClass('cn-button-layout-horizontal')
    })

    test('should update when horizontalAlign changes', () => {
      const { rerender, container } = render(
        <ButtonLayout horizontalAlign="start">
          <button>Test</button>
        </ButtonLayout>
      )

      let layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')

      rerender(
        <ButtonLayout horizontalAlign="end">
          <button>Test</button>
        </ButtonLayout>
      )

      layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-horizontal-end')
      expect(layout).not.toHaveClass('cn-button-layout-horizontal-start')
    })

    test('should update when className changes', () => {
      const { rerender, container } = render(
        <ButtonLayout className="class1">
          <button>Test</button>
        </ButtonLayout>
      )

      let layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('class1')

      rerender(
        <ButtonLayout className="class2">
          <button>Test</button>
        </ButtonLayout>
      )

      layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('class2')
      expect(layout).not.toHaveClass('class1')
    })

    test('should update children content', () => {
      const { rerender } = render(
        <ButtonLayout>
          <button>Initial</button>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Initial' })).toBeInTheDocument()

      rerender(
        <ButtonLayout>
          <button>Updated</button>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Updated' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Initial' })).not.toBeInTheDocument()
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty Primary section', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary>{null}</ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <button>Cancel</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(container.querySelector('.cn-button-layout-primary')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should handle empty Secondary section', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Save</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>{null}</ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(container.querySelector('.cn-button-layout-secondary')).toBeInTheDocument()
    })

    test('should render many buttons in Primary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            {Array.from({ length: 5 }, (_, i) => (
              <button key={i}>Button {i}</button>
            ))}
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Button 0' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Button 4' })).toBeInTheDocument()
    })

    test('should render many buttons in Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            {Array.from({ length: 5 }, (_, i) => (
              <button key={i}>Action {i}</button>
            ))}
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Action 0' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 4' })).toBeInTheDocument()
    })

    test('should handle string children', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>Text Content</ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByText('Text Content')).toBeInTheDocument()
    })

    test('should handle mixed children types', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Button</button>
            <span>Text</span>
            <div>Div</div>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
      expect(screen.getByText('Div')).toBeInTheDocument()
    })
  })

  describe('Props Forwarding on Root', () => {
    test('should forward onClick to Root', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <ButtonLayout onClick={handleClick}>
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      layout?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should forward style prop to Root', () => {
      const { container } = render(
        <ButtonLayout style={{ backgroundColor: 'red' }}>
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout') as HTMLElement
      expect(layout).toHaveAttribute('style')
      expect(layout.style.backgroundColor).toBe('red')
    })

    test('should forward title attribute to Root', () => {
      const { container } = render(
        <ButtonLayout title="Button Layout">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveAttribute('title', 'Button Layout')
    })

    test('should forward aria attributes to Root', () => {
      const { container } = render(
        <ButtonLayout aria-label="Actions" role="group">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveAttribute('aria-label', 'Actions')
      expect(layout).toHaveAttribute('role', 'group')
    })
  })

  describe('Complex State Combinations', () => {
    test('should handle all props together', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <ButtonLayout
          orientation="vertical"
          horizontalAlign="start"
          className="custom"
          onClick={handleClick}
          data-testid="complex-layout"
        >
          <ButtonLayout.Primary className="primary-custom">
            <button>Save</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary className="secondary-custom">
            <button>Cancel</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')
      expect(layout).toHaveClass('custom')
      expect(layout).toHaveAttribute('data-testid', 'complex-layout')

      expect(container.querySelector('.primary-custom')).toBeInTheDocument()
      expect(container.querySelector('.secondary-custom')).toBeInTheDocument()

      layout?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalled()
    })

    test('should handle reversed order of Primary and Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <button>Cancel</button>
          </ButtonLayout.Secondary>
          <ButtonLayout.Primary>
            <button>Save</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    test('should handle multiple Primary sections', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <button>Action 1</button>
          </ButtonLayout.Primary>
          <ButtonLayout.Primary>
            <button>Action 2</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })

    test('should handle multiple Secondary sections', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <button>Cancel</button>
          </ButtonLayout.Secondary>
          <ButtonLayout.Secondary>
            <button>Reset</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })
  })

  describe('Nested and Complex Children', () => {
    test('should render nested components in Primary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <div>
              <button>Save</button>
              <button>Save As</button>
            </div>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save As' })).toBeInTheDocument()
    })

    test('should render nested components in Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary>
            <div>
              <button>Cancel</button>
              <button>Reset</button>
            </div>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })

    test('should render complex JSX structures', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary>
            <div className="button-group">
              <button>Primary 1</button>
              <button>Primary 2</button>
            </div>
          </ButtonLayout.Primary>
          <ButtonLayout.Secondary>
            <div className="cancel-group">
              <button>Cancel</button>
            </div>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      expect(screen.getByRole('button', { name: 'Primary 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Primary 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('Class Name Combinations', () => {
    test('should combine multiple custom classes', () => {
      const { container } = render(
        <ButtonLayout className="class1 class2 class3">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('class1')
      expect(layout).toHaveClass('class2')
      expect(layout).toHaveClass('class3')
    })

    test('should combine custom classes with variant classes', () => {
      const { container } = render(
        <ButtonLayout orientation="vertical" horizontalAlign="start" className="custom">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')
      expect(layout).toHaveClass('custom')
    })
  })

  describe('Additional Props on Primary and Secondary', () => {
    test('should forward onClick to Primary', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary onClick={handleClick}>
            <button>Test</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const primary = container.querySelector('.cn-button-layout-primary')
      primary?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should forward onClick to Secondary', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Secondary onClick={handleClick}>
            <button>Test</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const secondary = container.querySelector('.cn-button-layout-secondary')
      secondary?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should forward style to Primary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Primary style={{ padding: '10px' }}>
            <button>Test</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const primary = container.querySelector('.cn-button-layout-primary')
      expect(primary).toHaveStyle({ padding: '10px' })
    })

    test('should forward style to Secondary', () => {
      const { container } = render(
        <ButtonLayout>
          <ButtonLayout.Secondary style={{ margin: '5px' }}>
            <button>Test</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const secondary = container.querySelector('.cn-button-layout-secondary')
      expect(secondary).toHaveStyle({ margin: '5px' })
    })
  })

  describe('Accessibility', () => {
    test('should support role attribute on Root', () => {
      const { container } = render(
        <ButtonLayout role="group">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveAttribute('role', 'group')
    })

    test('should support aria-labelledby on Root', () => {
      const { container } = render(
        <ButtonLayout aria-labelledby="actions-label">
          <button>Test</button>
        </ButtonLayout>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveAttribute('aria-labelledby', 'actions-label')
    })

    test('should support aria attributes on Primary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Primary aria-label="Primary actions">
            <button>Save</button>
          </ButtonLayout.Primary>
        </ButtonLayout>
      )

      const primary = screen.getByLabelText('Primary actions')
      expect(primary).toBeInTheDocument()
    })

    test('should support aria attributes on Secondary', () => {
      render(
        <ButtonLayout>
          <ButtonLayout.Secondary aria-label="Secondary actions">
            <button>Cancel</button>
          </ButtonLayout.Secondary>
        </ButtonLayout>
      )

      const secondary = screen.getByLabelText('Secondary actions')
      expect(secondary).toBeInTheDocument()
    })
  })

  describe('Using Root Component Directly', () => {
    test('should work when using Root directly', () => {
      const { container } = render(
        <ButtonLayout.Root>
          <ButtonLayout.Primary>
            <button>Primary</button>
          </ButtonLayout.Primary>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument()
    })

    test('should apply all variants when using Root', () => {
      const { container } = render(
        <ButtonLayout.Root orientation="vertical" horizontalAlign="start" className="root-custom">
          <button>Test</button>
        </ButtonLayout.Root>
      )

      const layout = container.querySelector('.cn-button-layout')
      expect(layout).toHaveClass('cn-button-layout-vertical')
      expect(layout).toHaveClass('cn-button-layout-horizontal-start')
      expect(layout).toHaveClass('root-custom')
    })
  })
})
