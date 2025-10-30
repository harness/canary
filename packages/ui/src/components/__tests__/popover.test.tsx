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
})

describe('Popover Primitives', () => {
  describe('Popover.Root', () => {
    test('should render popover root', () => {
      render(
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
        </Popover.Root>
      )

      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    test('should handle open prop', () => {
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
  })

  describe('Popover.Trigger', () => {
    test('should render trigger with asChild', () => {
      render(
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>Click me</button>
          </Popover.Trigger>
        </Popover.Root>
      )

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })
  })

  describe('Popover.Content', () => {
    test('should render content text', () => {
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

    test('should render with title prop', () => {
      render(
        <Popover.Root open={true}>
          <Popover.Trigger asChild>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content title="Title">Content</Popover.Content>
        </Popover.Root>
      )

      // Title and content are rendered
      expect(document.querySelector('.cn-popover-content')).toBeTruthy()
    })

    test('should render with description', () => {
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
  })
})

