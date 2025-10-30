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
})
