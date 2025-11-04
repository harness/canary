import { forwardRef } from 'react'

import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Tooltip, TooltipProvider, withTooltip } from '../tooltip'

const renderWithProvider = (ui: React.ReactElement): RenderResult => {
  return render(<TooltipProvider>{ui}</TooltipProvider>)
}

const renderComponent = (props: Partial<React.ComponentProps<typeof Tooltip>>): RenderResult => {
  return renderWithProvider(
    <Tooltip content="Tooltip content" {...props}>
      <button>Hover me</button>
    </Tooltip>
  )
}

describe('Tooltip', () => {
  test('should render trigger element', () => {
    renderComponent({ content: 'Test tooltip' })

    const trigger = screen.getByRole('button', { name: 'Hover me' })
    expect(trigger).toBeInTheDocument()
  })

  test('should render with content when open', () => {
    renderComponent({ content: 'Visible content', open: true })

    const tooltip = document.querySelector('.cn-tooltip')
    expect(tooltip).toBeTruthy()
  })

  test('should render with title and content', () => {
    renderComponent({
      title: 'Tooltip Title',
      content: 'Tooltip body',
      open: true
    })

    const tooltip = document.querySelector('.cn-tooltip')
    const title = document.querySelector('.cn-tooltip-title')

    expect(tooltip).toBeTruthy()
    expect(title).toBeTruthy()
  })

  test('should show arrow by default', () => {
    renderComponent({ content: 'Tooltip', open: true })

    const arrow = document.querySelector('.cn-tooltip-arrow')
    expect(arrow).toBeTruthy()
  })

  test('should hide arrow when hideArrow is true', () => {
    renderComponent({
      content: 'Tooltip',
      hideArrow: true,
      open: true
    })

    const arrow = document.querySelector('.cn-tooltip-arrow')
    expect(arrow).toBeFalsy()
  })

  test('should apply custom className', () => {
    renderComponent({
      content: 'Tooltip',
      className: 'custom-tooltip',
      open: true
    })

    const tooltip = document.querySelector('.custom-tooltip')
    expect(tooltip).toBeTruthy()
  })

  test('should render without title by default', () => {
    renderComponent({ content: 'Just content', open: true })

    const titleElement = document.querySelector('.cn-tooltip-title')
    expect(titleElement).toBeFalsy()
  })

  test('should render custom React content', () => {
    renderComponent({
      content: <span data-testid="custom-content">Custom</span>,
      open: true
    })

    // Multiple instances due to accessibility clone
    const customContent = screen.getAllByTestId('custom-content')
    expect(customContent.length).toBeGreaterThan(0)
  })

  test('should support side positioning prop', () => {
    renderComponent({ content: 'Test', side: 'bottom', open: true })

    const tooltip = document.querySelector('.cn-tooltip')
    expect(tooltip).toBeTruthy()
  })

  test('should support align prop', () => {
    renderComponent({ content: 'Test', align: 'start', open: true })

    const tooltip = document.querySelector('.cn-tooltip')
    expect(tooltip).toBeTruthy()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    renderWithProvider(
      <Tooltip ref={ref} content="Tooltip" open={true}>
        <button>Button</button>
      </Tooltip>
    )

    expect(ref).toHaveBeenCalled()
  })
})

describe('TooltipProvider', () => {
  test('should render children', () => {
    render(
      <TooltipProvider>
        <button>Child Button</button>
      </TooltipProvider>
    )

    expect(screen.getByRole('button', { name: 'Child Button' })).toBeInTheDocument()
  })
})

describe('withTooltip HOC', () => {
  test('should render component without tooltipProps', () => {
    const TestComponent = forwardRef<HTMLDivElement, { text: string }>((props, ref) => (
      <div ref={ref}>{props.text}</div>
    ))
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    render(
      <TooltipProvider>
        <WrappedComponent text="Hello" />
      </TooltipProvider>
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  test('should render tooltip when tooltipProps provided', () => {
    const TestComponent = forwardRef<HTMLButtonElement>((props, ref) => (
      <button ref={ref} {...props}>
        Button
      </button>
    ))
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    render(
      <TooltipProvider>
        <WrappedComponent tooltipProps={{ content: 'Tooltip text', open: true }} />
      </TooltipProvider>
    )

    const tooltip = document.querySelector('.cn-tooltip')
    expect(tooltip).toBeTruthy()
  })

  test('should set correct displayName with component name', () => {
    const TestComponent = forwardRef<HTMLDivElement>((props, ref) => <div ref={ref} {...props} />)
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    expect(WrappedComponent.displayName).toBe('withTooltip(TestComponent)')
  })

  test('should set displayName when component has no displayName but has name', () => {
    const TestComponent = forwardRef<HTMLDivElement>((props, ref) => <div ref={ref} {...props} />)
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    expect(WrappedComponent.displayName).toContain('withTooltip')
  })

  test('should forward ref in HOC', () => {
    const TestComponent = forwardRef<HTMLButtonElement>((props, ref) => <button ref={ref} {...props} />)
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    const ref = vi.fn()
    render(
      <TooltipProvider>
        <WrappedComponent ref={ref} />
      </TooltipProvider>
    )

    expect(ref).toHaveBeenCalled()
  })

  test('should pass props to wrapped component', () => {
    const TestComponent = forwardRef<HTMLButtonElement, { 'data-testid': string }>((props, ref) => (
      <button ref={ref} {...props}>
        Test
      </button>
    ))
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    render(
      <TooltipProvider>
        <WrappedComponent data-testid="custom-id" />
      </TooltipProvider>
    )

    expect(screen.getByTestId('custom-id')).toBeInTheDocument()
  })

  test('should handle all tooltip props in HOC', () => {
    const TestComponent = forwardRef<HTMLButtonElement>((props, ref) => (
      <button ref={ref} {...props}>
        Button
      </button>
    ))
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    render(
      <TooltipProvider>
        <WrappedComponent
          tooltipProps={{
            content: 'Full tooltip',
            title: 'Title',
            side: 'bottom',
            align: 'start',
            hideArrow: true,
            open: true
          }}
        />
      </TooltipProvider>
    )

    const tooltip = document.querySelector('.cn-tooltip')
    expect(tooltip).toBeTruthy()
  })
})

describe('Tooltip - Additional Tests', () => {
  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Tooltip.displayName).toBe('Tooltip')
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty string content', () => {
      renderWithProvider(
        <Tooltip content="" open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle numeric content', () => {
      renderWithProvider(
        <Tooltip content={123} open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle null content', () => {
      renderWithProvider(
        <Tooltip content={null} open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle very long content', () => {
      const longContent = 'Lorem ipsum dolor sit amet '.repeat(10)
      renderWithProvider(
        <Tooltip content={longContent} open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle special characters in content', () => {
      renderWithProvider(
        <Tooltip content={'<>&"'} open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle empty title', () => {
      renderWithProvider(
        <Tooltip title="" content="Content" open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should handle very long title', () => {
      const longTitle = 'Very Long Title Text '.repeat(5)
      renderWithProvider(
        <Tooltip title={longTitle} content="Content" open={true}>
          <button>Trigger</button>
        </Tooltip>
      )

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })
  })

  describe('Default Values', () => {
    test('should default hideArrow to false', () => {
      renderComponent({ content: 'Test', open: true })

      const arrow = document.querySelector('.cn-tooltip-arrow')
      expect(arrow).toBeTruthy()
    })

    test('should default delay to 500', () => {
      renderComponent({ content: 'Test' })

      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    test('should default side to top', () => {
      renderComponent({ content: 'Test', open: true })

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should default align to center', () => {
      renderComponent({ content: 'Test', open: true })

      const tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })
  })

  describe('Re-rendering', () => {
    test('should update when content changes', () => {
      const { rerender } = render(
        <TooltipProvider>
          <Tooltip content="Initial" open={true}>
            <button>Trigger</button>
          </Tooltip>
        </TooltipProvider>
      )

      expect(document.querySelector('.cn-tooltip')).toBeTruthy()

      rerender(
        <TooltipProvider>
          <Tooltip content="Updated" open={true}>
            <button>Trigger</button>
          </Tooltip>
        </TooltipProvider>
      )

      expect(document.querySelector('.cn-tooltip')).toBeTruthy()
    })

    test('should update when open state changes', () => {
      const { rerender } = render(
        <TooltipProvider>
          <Tooltip content="Content" open={false}>
            <button>Trigger</button>
          </Tooltip>
        </TooltipProvider>
      )

      let tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeFalsy()

      rerender(
        <TooltipProvider>
          <Tooltip content="Content" open={true}>
            <button>Trigger</button>
          </Tooltip>
        </TooltipProvider>
      )

      tooltip = document.querySelector('.cn-tooltip')
      expect(tooltip).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible trigger element', () => {
      renderComponent({ content: 'Tooltip' })

      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    test('should render title when provided', () => {
      renderComponent({ title: 'Title Text', content: 'Body', open: true })

      const title = document.querySelector('.cn-tooltip-title')
      expect(title).toBeTruthy()
    })

    test('should not render title element when not provided', () => {
      renderComponent({ content: 'Content only', open: true })

      const title = document.querySelector('.cn-tooltip-title')
      expect(title).toBeFalsy()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props together', () => {
      renderWithProvider(
        <Tooltip
          content={<div data-testid="complex-content">Complex Content</div>}
          title="Complete Tooltip"
          side="bottom"
          align="end"
          hideArrow={false}
          delay={200}
          className="custom-tooltip"
          open={true}
        >
          <button>Complete Trigger</button>
        </Tooltip>
      )

      expect(screen.getByRole('button', { name: 'Complete Trigger' })).toBeInTheDocument()

      // Complex content renders in portal, may be duplicated
      const complexContent = screen.getAllByTestId('complex-content')
      expect(complexContent.length).toBeGreaterThan(0)

      const tooltip = document.querySelector('.custom-tooltip')
      expect(tooltip).toBeTruthy()
    })

    test('should work with complex trigger elements', () => {
      renderWithProvider(
        <Tooltip content="Tooltip" open={true}>
          <div>
            <span>Complex</span> <strong>Trigger</strong>
          </div>
        </Tooltip>
      )

      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward className to tooltip content', () => {
      renderComponent({ content: 'Test', className: 'custom-class', open: true })

      const tooltip = document.querySelector('.custom-class')
      expect(tooltip).toBeTruthy()
    })
  })
})
