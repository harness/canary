import { render, RenderResult, screen } from '@testing-library/react'
import { forwardRef } from 'react'
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

  test('should set correct displayName', () => {
    const TestComponent = forwardRef<HTMLDivElement>((props, ref) => <div ref={ref} {...props} />)
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withTooltip(TestComponent)

    expect(WrappedComponent.displayName).toBe('withTooltip(TestComponent)')
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
      <button ref={ref} {...props}>Test</button>
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
})
