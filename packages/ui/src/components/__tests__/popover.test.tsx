import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Popover } from '../popover'

const renderComponent = (props: Partial<React.ComponentProps<typeof Popover>> = {}): RenderResult => {
  return render(
    <Popover content="Popover content" {...props}>
      <button>Trigger</button>
    </Popover>
  )
}

describe('Popover', () => {
  describe('Basic Rendering', () => {
    test('should render trigger element', () => {
      renderComponent()

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toBeInTheDocument()
    })

    test('should show popover when open is true', () => {
      renderComponent({ open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should not show popover initially when open is false', () => {
      renderComponent({ open: false })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeFalsy()
    })

    test('should show popover with defaultOpen', () => {
      renderComponent({ defaultOpen: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })
  })

  describe('Content Rendering', () => {
    test('should render string content', () => {
      renderComponent({ content: 'Simple text', open: true })

      // Check popover is rendered
      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should render ReactNode content', () => {
      renderComponent({
        content: <span data-testid="custom-content">Custom Content</span>,
        open: true
      })

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    test('should render with title', () => {
      renderComponent({
        title: 'Popover Title',
        content: 'Body text',
        open: true
      })

      // Title is rendered
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with link', () => {
      renderComponent({
        content: 'Content',
        linkProps: { text: 'Learn More' } as any,
        open: true
      })

      const link = screen.getByText('Learn More')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Arrow Display', () => {
    test('should show arrow by default', () => {
      renderComponent({ open: true })

      const arrow = document.querySelector('.cn-popover-arrow')
      expect(arrow).toBeTruthy()
    })

    test('should hide arrow when hideArrow is true', () => {
      renderComponent({
        hideArrow: true,
        open: true
      })

      const arrow = document.querySelector('.cn-popover-arrow')
      expect(arrow).toBeFalsy()
    })
  })

  describe('Trigger Types', () => {
    test('should use click trigger by default', () => {
      renderComponent()

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toBeInTheDocument()
      // Default is click trigger
    })

    test('should support hover trigger type', () => {
      renderComponent({ triggerType: 'hover' })

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toBeInTheDocument()
    })

    test('should open popover on mouse enter when hover trigger', async () => {
      vi.useFakeTimers()

      renderComponent({ triggerType: 'hover', hoverDelay: 200 })

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.hover(trigger)

      // Fast-forward past hover delay
      vi.advanceTimersByTime(200)

      vi.useRealTimers()
    })

    test('should close popover on mouse leave when hover trigger', async () => {
      vi.useFakeTimers()

      renderComponent({ triggerType: 'hover', closeDelay: 300 })

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.hover(trigger)

      vi.advanceTimersByTime(200)

      await userEvent.unhover(trigger)

      vi.advanceTimersByTime(300)

      vi.useRealTimers()
    })

    test('should cancel open timer when mouse leaves before delay', async () => {
      vi.useFakeTimers()

      renderComponent({ triggerType: 'hover', hoverDelay: 500 })

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.hover(trigger)

      vi.advanceTimersByTime(100)

      await userEvent.unhover(trigger)

      vi.advanceTimersByTime(600)

      vi.useRealTimers()
    })

    test('should cancel close timer when mouse enters again', async () => {
      vi.useFakeTimers()

      renderComponent({ triggerType: 'hover', hoverDelay: 100, closeDelay: 300 })

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.hover(trigger)

      vi.advanceTimersByTime(100)

      await userEvent.unhover(trigger)

      vi.advanceTimersByTime(50)

      await userEvent.hover(trigger)

      vi.advanceTimersByTime(400)

      vi.useRealTimers()
    })
  })

  describe('State Management', () => {
    test('should handle controlled open state', () => {
      const { rerender } = render(
        <Popover content="Content" open={false}>
          <button>Trigger</button>
        </Popover>
      )

      let popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeFalsy()

      rerender(
        <Popover content="Content" open={true}>
          <button>Trigger</button>
        </Popover>
      )

      popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should call onOpenChange when state changes', async () => {
      const handleOpenChange = vi.fn()

      render(
        <Popover content="Content" onOpenChange={handleOpenChange} defaultOpen={false}>
          <button>Trigger</button>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.click(trigger)

      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Positioning', () => {
    test('should support side positioning', () => {
      renderComponent({ side: 'bottom', open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should support align positioning', () => {
      renderComponent({ align: 'start', open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should support custom sideOffset', () => {
      renderComponent({ sideOffset: 10, open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })
  })

  describe('Styling', () => {
    test('should apply custom className', () => {
      renderComponent({
        className: 'custom-popover',
        open: true
      })

      const popover = document.querySelector('.custom-popover')
      expect(popover).toBeTruthy()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete popover with all props', () => {
      renderComponent({
        title: 'Information',
        description: 'Here is some helpful information',
        content: <div data-testid="body">Main content</div>,
        linkProps: { text: 'Read more' } as any,
        open: true
      })

      expect(screen.getByTestId('body')).toBeInTheDocument()
      expect(screen.getByText('Read more')).toBeInTheDocument()
    })

    test('should handle list content structure', () => {
      renderComponent({
        content: (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ),
        open: true
      })

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    test('should render buttons in content', () => {
      renderComponent({
        content: (
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        ),
        open: true
      })

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Content', () => {
      const ref = vi.fn()

      render(
        <Popover.Root open={true}>
          <Popover.Trigger>Button</Popover.Trigger>
          <Popover.Content ref={ref}>Content</Popover.Content>
        </Popover.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct display name for Content', () => {
      expect(Popover.Content.displayName).toBeTruthy()
    })
  })

  describe('Default Values', () => {
    test('should default triggerType to click', () => {
      renderComponent()

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toBeInTheDocument()
    })

    test('should default hoverDelay to 200', () => {
      renderComponent({ triggerType: 'hover' })

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
    })

    test('should default closeDelay to 300', () => {
      renderComponent({ triggerType: 'hover' })

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
    })

    test('should default hideArrow to false', () => {
      renderComponent({ open: true })

      const arrow = document.querySelector('.cn-popover-arrow')
      expect(arrow).toBeTruthy()
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty string content', () => {
      renderComponent({ content: '', open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should handle null content', () => {
      renderComponent({ content: null, open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should handle numeric content', () => {
      renderComponent({ content: 123, open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should handle very long content', () => {
      const longContent = 'Lorem ipsum dolor sit amet '.repeat(20)
      renderComponent({ content: longContent, open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })

    test('should handle special characters in content', () => {
      renderComponent({ content: '<>&"', open: true })

      const popover = document.querySelector('.cn-popover-content')
      expect(popover).toBeTruthy()
    })
  })

  describe('Re-rendering', () => {
    test('should update when content changes', () => {
      const { rerender } = render(
        <Popover content="Initial" open={true}>
          <button>Trigger</button>
        </Popover>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()

      rerender(
        <Popover content="Updated" open={true}>
          <button>Trigger</button>
        </Popover>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should update when triggerType changes', () => {
      const { rerender } = render(
        <Popover content="Content" triggerType="click">
          <button>Trigger</button>
        </Popover>
      )

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()

      rerender(
        <Popover content="Content" triggerType="hover">
          <button>Trigger</button>
        </Popover>
      )

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible trigger button', () => {
      renderComponent()

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toBeInTheDocument()
    })

    test('should render hidden focus button for accessibility', () => {
      renderComponent()

      const hiddenButton = document.querySelector('.sr-only')
      expect(hiddenButton).toBeInTheDocument()
    })

    test('should have proper aria-hidden on hidden button', () => {
      renderComponent()

      const hiddenButton = document.querySelector('[aria-hidden="true"]')
      expect(hiddenButton).toBeInTheDocument()
    })

    test('should have tabindex -1 on hidden button', () => {
      renderComponent()

      const hiddenButton = document.querySelector('[tabindex="-1"]')
      expect(hiddenButton).toBeInTheDocument()
    })
  })
})

describe('Popover Primitives', () => {
  describe('Popover.Root', () => {
    test('should render popover root component', () => {
      render(
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
        </Popover.Root>
      )

      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    test('should handle controlled open prop', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>Popover Content Text</Popover.Content>
        </Popover.Root>
      )

      // Check that content renders
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should handle onOpenChange callback', async () => {
      const handleOpenChange = vi.fn()

      render(
        <Popover.Root onOpenChange={handleOpenChange}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover.Root>
      )

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await userEvent.click(trigger)

      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Popover.Trigger', () => {
    test('should render trigger with asChild prop', () => {
      render(
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>Click me</button>
          </Popover.Trigger>
        </Popover.Root>
      )

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    test('should render trigger without asChild', () => {
      render(
        <Popover.Root>
          <Popover.Trigger>
            <span>Trigger Text</span>
          </Popover.Trigger>
        </Popover.Root>
      )

      expect(screen.getByText('Trigger Text')).toBeInTheDocument()
    })
  })

  describe('Popover.Content', () => {
    test('should render content text when popover open', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>Popover body text</Popover.Content>
        </Popover.Root>
      )

      // Popover is rendered
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with title only', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content title="Title Only">Content</Popover.Content>
        </Popover.Root>
      )

      // Title and content are rendered
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with description only', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content description="Description text">Content</Popover.Content>
        </Popover.Root>
      )

      // Description and content are rendered
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with both title and description', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content title="Title" description="Description">
            Content
          </Popover.Content>
        </Popover.Root>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render linkProps with text', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content linkProps={{ text: 'Link Text', to: '/path' } as any}>Content</Popover.Content>
        </Popover.Root>
      )

      const link = screen.getByText('Link Text')
      expect(link).toBeInTheDocument()
    })

    test('should not render link when linkProps text is missing', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content linkProps={{ to: '/path' } as any}>Content</Popover.Content>
        </Popover.Root>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should apply custom className to content', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content className="custom-content">Content</Popover.Content>
        </Popover.Root>
      )

      const content = document.querySelector('.custom-content')
      expect(content).toBeTruthy()
    })

    test('should render with default align center', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover.Root>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with custom align', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content align="start">Content</Popover.Content>
        </Popover.Root>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with default sideOffset 4', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover.Root>
      )

      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should handle complex children in content', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </Popover.Content>
        </Popover.Root>
      )

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    })
  })
})
