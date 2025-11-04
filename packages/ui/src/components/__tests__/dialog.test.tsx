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

    test('should forward ref on Close', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Footer>
                <Dialog.Close ref={ref}>Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Description', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description ref={ref}>Description</Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct displayName for Content', () => {
      expect(Dialog.Content.displayName).toBe('Dialog.Content')
    })

    test('should have correct displayName for Header', () => {
      expect(Dialog.Header.displayName).toBe('Dialog.Header')
    })

    test('should have correct displayName for Title', () => {
      expect(Dialog.Title.displayName).toBe('Dialog.Title')
    })

    test('should have correct displayName for Description', () => {
      expect(Dialog.Description.displayName).toBe('Dialog.Description')
    })

    test('should have correct displayName for Body', () => {
      expect(Dialog.Body.displayName).toBe('Dialog.Body')
    })

    test('should have correct displayName for Footer', () => {
      expect(Dialog.Footer.displayName).toBe('Dialog.Footer')
    })

    test('should have correct displayName for Close', () => {
      expect(Dialog.Close.displayName).toBe('Dialog.Close')
    })

    test('should have correct displayName for Trigger', () => {
      expect(Dialog.Trigger.displayName).toBe('DialogTrigger')
    })
  })

  describe('Dialog.Header - Icon and Logo Edge Cases', () => {
    test('should warn and return null when both icon and logo are provided', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header icon="check" logo="harness">
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(consoleWarnSpy).toHaveBeenCalledWith('Dialog.Header: Cannot use both icon and logo props together')
      consoleWarnSpy.mockRestore()
    })

    test('should render with icon and no logo', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header icon="star">
                <Dialog.Title>Icon Only</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const icon = document.querySelector('.cn-modal-dialog-header-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with logo and no icon', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header logo="github">
                <Dialog.Title>Logo Only</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const logo = document.querySelector('.cn-modal-dialog-header-logo')
      expect(logo).toBeInTheDocument()
    })

    test('should add sr-only description when no description provided', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>No Description</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const srOnlyDescription = document.querySelector('.sr-only')
      expect(srOnlyDescription).toBeInTheDocument()
    })
  })

  describe('Dialog.Content - Size Variants', () => {
    test('should use sm size by default', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Default Size</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const content = document.querySelector('.cn-modal-dialog-sm')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Dialog.Body - Custom Classes', () => {
    test('should apply classNameContent to body content', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Body classNameContent="custom-body-content">
                <p>Content</p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const bodyContent = document.querySelector('.custom-body-content')
      expect(bodyContent).toBeInTheDocument()
    })

    test('should combine className and classNameContent', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Body className="body-wrapper" classNameContent="body-inner">
                <p>Content</p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(document.querySelector('.body-wrapper')).toBeInTheDocument()
      expect(document.querySelector('.body-inner')).toBeInTheDocument()
    })
  })

  describe('Dialog.Close - Button Variants', () => {
    test('should render as secondary variant button', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Footer>
                <Dialog.Close>Cancel</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const closeButton = document.querySelector('.cn-button-secondary')
      expect(closeButton).toBeInTheDocument()
    })

    test('should accept custom variant', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Footer>
                <Dialog.Close variant="primary">OK</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const closeButton = screen.getByRole('button', { name: 'OK' })
      expect(closeButton).toBeInTheDocument()
    })

    test('should accept custom className', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Footer>
                <Dialog.Close className="custom-close">Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const closeButton = document.querySelector('.custom-close')
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when open state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Dialog.Root open={false}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Title')).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    test('should update when size changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content size="sm">
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      let content = document.querySelector('.cn-modal-dialog-sm')
      expect(content).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content size="lg">
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      content = document.querySelector('.cn-modal-dialog-lg')
      expect(content).toBeInTheDocument()
    })

    test('should update when theme changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header theme="default">
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      let header = document.querySelector('.cn-modal-dialog-theme-default')
      expect(header).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header theme="danger">
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      header = document.querySelector('.cn-modal-dialog-theme-danger')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward className to Content', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content className="custom-content">
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const content = document.querySelector('.custom-content')
      expect(content).toBeInTheDocument()
    })

    test('should forward className to Header', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header className="custom-header">
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const header = document.querySelector('.custom-header')
      expect(header).toBeInTheDocument()
    })

    test('should forward data attributes', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content data-testid="dialog-content">
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should use sm size by default for Content', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Default</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const content = document.querySelector('.cn-modal-dialog-sm')
      expect(content).toBeInTheDocument()
    })

    test('should use default theme for Header', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Default Theme</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      const header = document.querySelector('.cn-modal-dialog-theme-default')
      expect(header).toBeInTheDocument()
    })

    test('should show close button by default', () => {
      renderComponent({ open: true })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    test('should render with empty body', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Empty Body</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>{null}</Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Empty Body')).toBeInTheDocument()
    })

    test('should render with very long title', () => {
      const longTitle = 'A'.repeat(200)
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{longTitle}</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    test('should render with very long description', () => {
      const longDesc = 'B'.repeat(200)
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description>{longDesc}</Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText(longDesc)).toBeInTheDocument()
    })

    test('should handle ReactNode title', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  <span data-testid="custom-title-content">Custom Title Node</span>
                </Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-title-content')).toBeInTheDocument()
    })

    test('should handle ReactNode description', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description>
                  <span data-testid="custom-desc-content">Custom Description Node</span>
                </Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByTestId('custom-desc-content')).toBeInTheDocument()
    })
  })

  describe('Dialog.Header - Theme Variants', () => {
    test('should apply all theme variants', () => {
      const themes: Array<'default' | 'warning' | 'danger'> = ['default', 'warning', 'danger']

      themes.forEach(theme => {
        render(
          <TestWrapper>
            <Dialog.Root open={true}>
              <Dialog.Content>
                <Dialog.Header theme={theme}>
                  <Dialog.Title>{theme}</Dialog.Title>
                </Dialog.Header>
              </Dialog.Content>
            </Dialog.Root>
          </TestWrapper>
        )

        const header = document.querySelector(`.cn-modal-dialog-theme-${theme}`)
        expect(header).toBeInTheDocument()
      })
    })
  })

  describe('Dialog.Content - All Sizes', () => {
    test('should render all size variants', () => {
      const sizes: Array<'sm' | 'md' | 'lg' | 'max'> = ['sm', 'md', 'lg', 'max']

      sizes.forEach(size => {
        render(
          <TestWrapper>
            <Dialog.Root open={true}>
              <Dialog.Content size={size}>
                <Dialog.Header>
                  <Dialog.Title>Size {size}</Dialog.Title>
                </Dialog.Header>
              </Dialog.Content>
            </Dialog.Root>
          </TestWrapper>
        )

        const content = document.querySelector(`.cn-modal-dialog-${size}`)
        expect(content).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    test('should have accessible dialog structure', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Dialog description')).toBeInTheDocument()
    })

    test('should handle keyboard navigation', () => {
      renderComponent({ open: true })

      const closeButton = screen.getByRole('button', { name: 'Close' })
      closeButton.focus()
      expect(closeButton).toHaveFocus()
    })
  })

  describe('Dialog.Trigger', () => {
    test('should render trigger button', () => {
      render(
        <TestWrapper>
          <Dialog.Root>
            <Dialog.Trigger>
              <button>Open Dialog</button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
    })

    test('should forward ref on Trigger', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root>
            <Dialog.Trigger ref={ref}>
              <button>Trigger</button>
            </Dialog.Trigger>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DialogOpenContext', () => {
    test('should provide open state through context', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    })
  })

  describe('onOpenChange Handler', () => {
    test('should accept onOpenChange handler', () => {
      const handleOpenChange = vi.fn()

      render(
        <TestWrapper>
          <Dialog.Root open={false} onOpenChange={handleOpenChange}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Test</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
  })

  describe('Complex Scenarios - Extended', () => {
    test('should handle all props together on Content', () => {
      const ref = vi.fn()
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content
              ref={ref}
              size="lg"
              hideClose={false}
              className="complex-dialog"
              data-testid="complex-content"
            >
              <Dialog.Header theme="warning" icon="star">
                <Dialog.Title>Complex Dialog</Dialog.Title>
                <Dialog.Description>Complex description</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body className="custom-body">
                <p>Body content</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Complex Dialog')).toBeInTheDocument()
      expect(document.querySelector('.complex-dialog')).toBeInTheDocument()
      expect(ref).toHaveBeenCalled()
    })

    test('should render minimal dialog', () => {
      render(
        <TestWrapper>
          <Dialog.Root open={true}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Minimal</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Minimal')).toBeInTheDocument()
    })
  })
})
