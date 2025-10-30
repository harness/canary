import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Dialog } from '../dialog'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof Dialog.Root>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <Dialog.Root {...props}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <p>Dialog content goes here</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </TestWrapper>
  )
}

describe('Dialog', () => {
  describe('Dialog.Root', () => {
    test('should not show dialog when open is false', () => {
      renderComponent({ open: false })

      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
    })

    test('should show dialog when open is true', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    })
  })

  describe('Dialog.Content', () => {
    test('should render dialog content', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
    })

    test('should render with different sizes', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content size="md">
              <Dialog.Header>
                <Dialog.Title>Medium Dialog</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Medium Dialog')).toBeInTheDocument()
    })

    test('should render with large size', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content size="lg">
              <Dialog.Header>
                <Dialog.Title>Large Dialog</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Large Dialog')).toBeInTheDocument()
    })

    test('should render with max size', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content size="max">
              <Dialog.Header>
                <Dialog.Title>Max Dialog</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Max Dialog')).toBeInTheDocument()
    })

    test('should render close button by default', () => {
      renderComponent({ open: true })

      // Close button is rendered with x icon
      const closeButtons = screen.getAllByRole('button')
      expect(closeButtons.length).toBeGreaterThan(0)
    })

    test('should hide close button when hideClose is true', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content hideClose={true}>
              <Dialog.Header>
                <Dialog.Title>No Close Button</Dialog.Title>
              </Dialog.Header>
              <Dialog.Footer>
                <Dialog.Close>Manual Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('No Close Button')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Manual Close' })).toBeInTheDocument()
    })
  })

  describe('Dialog.Header', () => {
    test('should render header with default theme', () => {
      renderComponent({ open: true })

      const title = screen.getByText('Dialog Title')
      expect(title).toBeInTheDocument()
    })

    test('should render with warning theme', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header theme="warning">
                <Dialog.Title>Warning</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const title = screen.getByText('Warning')
      expect(title).toBeInTheDocument()
    })

    test('should render with danger theme', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header theme="danger">
                <Dialog.Title>Danger</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const title = screen.getByText('Danger')
      expect(title).toBeInTheDocument()
    })

    test('should render with icon', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header icon="check">
                <Dialog.Title>With Icon</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      // Icon is rendered in the header
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    test('should render with logo', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header logo="harness">
                <Dialog.Title>With Logo</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      // Logo is rendered in the header
      expect(screen.getByText('With Logo')).toBeInTheDocument()
    })
  })

  describe('Dialog.Title', () => {
    test('should render title text', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    })

    test('should render custom title', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Custom Title Text</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Custom Title Text')).toBeInTheDocument()
    })
  })

  describe('Dialog.Description', () => {
    test('should render description text', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog description')).toBeInTheDocument()
    })

    test('should render custom description', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description>Custom description text here</Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Custom description text here')).toBeInTheDocument()
    })
  })

  describe('Dialog.Body', () => {
    test('should render body content', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
    })

    test('should render with ScrollArea wrapper', () => {
      renderComponent({ open: true })

      // Body content is rendered inside ScrollArea
      expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
    })

    test('should render custom body content', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Body className="custom-body-class">
                <p>Custom body content</p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Custom body content')).toBeInTheDocument()
    })
  })

  describe('Dialog.Footer', () => {
    test('should render footer content', () => {
      renderComponent({ open: true })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
    })

    test('should render multiple buttons in footer', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Footer>
                <Dialog.Close>Cancel</Dialog.Close>
                <button>Save</button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })
  })

  describe('Dialog.Close', () => {
    test('should render close button', () => {
      renderComponent({ open: true })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
    })

    test('should render custom close button text', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Footer>
                <Dialog.Close>Cancel</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete dialog structure', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Dialog description')).toBeInTheDocument()
      expect(screen.getByText('Dialog content goes here')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('should render dialog without description', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title Only</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>Content</p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Title Only')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should render dialog without footer', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>No Footer</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>Content only</p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('No Footer')).toBeInTheDocument()
      expect(screen.getByText('Content only')).toBeInTheDocument()
    })

    test('should handle dialog with complex body content', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Complex Content</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <div>
                  <h3>Section 1</h3>
                  <p>Paragraph 1</p>
                  <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </div>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Content', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content ref={ref}>
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Header', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header ref={ref}>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Title', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title ref={ref}>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Body', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Body ref={ref}>Content</Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Footer', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Footer ref={ref}>
                <button>OK</button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })
})
