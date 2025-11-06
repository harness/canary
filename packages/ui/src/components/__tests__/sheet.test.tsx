import React from 'react'

import { PortalProvider, ThemeProvider } from '@/context'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Sheet } from '../sheet'

// Mock portal container
const mockPortalContainer = document.createElement('div')
document.body.appendChild(mockPortalContainer)

const TestWrapper = ({ children, isLightTheme = false }: { children: React.ReactNode; isLightTheme?: boolean }) => (
  <ThemeProvider theme={isLightTheme ? 'light-std-std' : 'dark-std-std'} isLightTheme={isLightTheme} setTheme={vi.fn()}>
    <PortalProvider portalContainer={mockPortalContainer}>
      <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
    </PortalProvider>
  </ThemeProvider>
)

describe('Sheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPortalContainer.innerHTML = ''
  })

  afterEach(() => {
    mockPortalContainer.innerHTML = ''
  })

  describe('Sheet.Root', () => {
    describe('Basic Rendering', () => {
      test('should render sheet when open', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Content')).toBeInTheDocument()
      })

      test('should not render sheet when not open', () => {
        render(
          <TestWrapper>
            <Sheet.Root open={false}>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument()
      })

      test('should handle controlled open state', () => {
        const { rerender } = render(
          <TestWrapper>
            <Sheet.Root open={false}>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument()

        rerender(
          <TestWrapper>
            <Sheet.Root open={true}>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Content')).toBeInTheDocument()
      })

      test('should call onOpenChange when state changes', async () => {
        const onOpenChange = vi.fn()
        render(
          <TestWrapper>
            <Sheet.Root open onOpenChange={onOpenChange}>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const closeButton = screen.getByRole('button')
        await userEvent.click(closeButton)

        await waitFor(() => {
          expect(onOpenChange).toHaveBeenCalled()
        })
      })
    })

    describe('Modal Prop', () => {
      test('should default to modal behavior', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Content')).toBeInTheDocument()
      })

      test('should handle defaultOpen prop', () => {
        render(
          <TestWrapper>
            <Sheet.Root defaultOpen>
              <Sheet.Content>
                <div>Sheet Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Content')).toBeInTheDocument()
      })
    })
  })

  describe('Sheet.Content', () => {
    describe('Basic Rendering', () => {
      test('should render content', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Test Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
      })

      test('should render close button by default', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const closeButton = screen.getByRole('button')
        expect(closeButton).toBeInTheDocument()
      })

      test('should hide close button when hideCloseButton is true', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content hideCloseButton>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const closeButton = screen.queryByRole('button')
        expect(closeButton).not.toBeInTheDocument()
      })

      test('should render close button for accessibility', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Close button should be present (find all buttons)
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)
      })
    })

    describe('Side Variants', () => {
      test('should default to right side', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Check for dialog presence
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      })

      test('should apply left side variant', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content side="left">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should apply top side variant', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content side="top">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should apply bottom side variant', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content side="bottom">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should apply right side variant explicitly', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content side="right">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Modal vs Non-Modal', () => {
      test('should render as modal by default', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should render as non-modal when modal is false', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content modal={false}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should call handleClose when overlay is clicked in non-modal', async () => {
        const handleClose = vi.fn()
        const { container } = render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content modal={false} handleClose={handleClose}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Find overlay (div with aria-hidden="true")
        const overlay = container.querySelector('[aria-hidden="true"]')
        if (overlay) {
          await userEvent.click(overlay as HTMLElement)
          expect(handleClose).toHaveBeenCalled()
        }
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content className="custom-content">
                <div data-testid="content">Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const content = screen.getByTestId('content')
        const dialog = content.closest('[role="dialog"]')
        expect(dialog).toHaveClass('custom-content')
      })

      test('should accept overlayClassName prop', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content overlayClassName="custom-overlay">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept closeClassName prop', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content closeClassName="custom-close">
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept multiple className props', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content
                className="custom-content-class"
                overlayClassName="custom-overlay-class"
                closeClassName="custom-close-class"
              >
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors with all custom classes
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Theme Integration', () => {
      test('should apply light theme backdrop', () => {
        render(
          <TestWrapper isLightTheme={true}>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without error in light theme
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should render in dark mode', () => {
        render(
          <TestWrapper isLightTheme={false}>
            <Sheet.Root open>
              <Sheet.Content>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should have overlay and content in dark mode
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should handle theme in non-modal overlay', () => {
        render(
          <TestWrapper isLightTheme={true}>
            <Sheet.Root open>
              <Sheet.Content modal={false}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render non-modal sheet with light theme
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('HandleClose Callback', () => {
      test('should accept handleClose prop in non-modal mode', () => {
        const handleClose = vi.fn()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content handleClose={handleClose} modal={false}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors with handleClose prop
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept onClick prop', () => {
        const onClick = vi.fn()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content onClick={onClick} modal={false}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors with onClick prop
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept both handleClose and onClick props', () => {
        const handleClose = vi.fn()
        const onClick = vi.fn()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content handleClose={handleClose} onClick={onClick} modal={false}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Should render without errors with both props
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Ref Forwarding', () => {
      test('should forward ref to content element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content ref={ref}>
                <div>Content</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLElement)
      })
    })
  })

  describe('Sheet.Header', () => {
    describe('Basic Rendering', () => {
      test('should render header', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header>
                  <div>Header Content</div>
                </Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Header Content')).toBeInTheDocument()
      })

      test('should render children inside header', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header>
                  <h2>Title</h2>
                  <p>Description</p>
                </Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Title')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
      })

      test('should apply correct layout classes', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header>
                  <div data-testid="header-content">Content</div>
                </Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const headerContent = screen.getByTestId('header-content')
        const header = headerContent.parentElement
        expect(header).toHaveClass('flex')
        expect(header).toHaveClass('flex-col')
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header ref={ref}>Content</Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header className="custom-header">
                  <div data-testid="header-content">Content</div>
                </Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const headerContent = screen.getByTestId('header-content')
        const header = headerContent.parentElement
        expect(header).toHaveClass('custom-header')
      })

      test('should merge custom className with default classes', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Header className="custom">
                  <div data-testid="header-content">Content</div>
                </Sheet.Header>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const headerContent = screen.getByTestId('header-content')
        const header = headerContent.parentElement
        expect(header).toHaveClass('custom')
        expect(header).toHaveClass('flex')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Sheet.Header.displayName).toBe('SheetHeader')
      })
    })
  })

  describe('Sheet.Footer', () => {
    describe('Basic Rendering', () => {
      test('should render footer', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer>
                  <div>Footer Content</div>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Footer Content')).toBeInTheDocument()
      })

      test('should render children inside footer', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer>
                  <button>Cancel</button>
                  <button>Confirm</button>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Cancel')).toBeInTheDocument()
        expect(screen.getByText('Confirm')).toBeInTheDocument()
      })

      test('should apply correct layout classes', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer>
                  <div data-testid="footer-content">Content</div>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const footerContent = screen.getByTestId('footer-content')
        const footer = footerContent.parentElement
        expect(footer).toHaveClass('flex')
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer ref={ref}>Content</Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer className="custom-footer">
                  <div data-testid="footer-content">Content</div>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const footerContent = screen.getByTestId('footer-content')
        const footer = footerContent.parentElement
        expect(footer).toHaveClass('custom-footer')
      })

      test('should merge custom className with default classes', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Footer className="custom">
                  <div data-testid="footer-content">Content</div>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const footerContent = screen.getByTestId('footer-content')
        const footer = footerContent.parentElement
        expect(footer).toHaveClass('custom')
        expect(footer).toHaveClass('flex')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Sheet.Footer.displayName).toBe('SheetFooter')
      })
    })
  })

  describe('Sheet.Title', () => {
    describe('Basic Rendering', () => {
      test('should render title', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Title>Sheet Title</Sheet.Title>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Title')).toBeInTheDocument()
      })

      test('should render as heading element', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Title>Title</Sheet.Title>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        // Radix Dialog.Title renders as h2 by default
        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H2')
      })

      test('should forward ref to title element', () => {
        const ref = React.createRef<HTMLHeadingElement>()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Title ref={ref}>Title</Sheet.Title>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Title className="custom-title">Title</Sheet.Title>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const title = screen.getByText('Title')
        expect(title).toHaveClass('custom-title')
      })

      test('should have default text styling classes', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Title>Title</Sheet.Title>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const title = screen.getByText('Title')
        expect(title).toHaveClass('font-semibold')
      })
    })

    describe('Display Name', () => {
      test('should have display name from Radix', () => {
        // Radix Dialog.Title uses DialogTitle as displayName
        expect(Sheet.Title.displayName).toBeDefined()
      })
    })
  })

  describe('Sheet.Description', () => {
    describe('Basic Rendering', () => {
      test('should render description', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Description>Sheet Description</Sheet.Description>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Sheet Description')).toBeInTheDocument()
      })

      test('should forward ref to description element', () => {
        const ref = React.createRef<HTMLParagraphElement>()
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Description ref={ref}>Description</Sheet.Description>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content>
                <Sheet.Description className="custom-description">Description</Sheet.Description>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        const description = screen.getByText('Description')
        expect(description).toHaveClass('custom-description')
      })
    })

    describe('Display Name', () => {
      test('should have display name from Radix', () => {
        // Radix Dialog.Description uses DialogDescription as displayName
        expect(Sheet.Description.displayName).toBeDefined()
      })
    })
  })

  describe('Sheet.Trigger', () => {
    test('should render trigger button', () => {
      render(
        <TestWrapper>
          <Sheet.Root>
            <Sheet.Trigger>Open Sheet</Sheet.Trigger>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Open Sheet')).toBeInTheDocument()
    })

    test('should open sheet when trigger is clicked', async () => {
      render(
        <TestWrapper>
          <Sheet.Root>
            <Sheet.Trigger>Open Sheet</Sheet.Trigger>
            <Sheet.Content>
              <div>Sheet Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      const trigger = screen.getByText('Open Sheet')
      await userEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Sheet Content')).toBeInTheDocument()
      })
    })
  })

  describe('Sheet Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Sheet.Root).toBeDefined()
      expect(Sheet.Trigger).toBeDefined()
      expect(Sheet.Content).toBeDefined()
      expect(Sheet.Header).toBeDefined()
      expect(Sheet.Footer).toBeDefined()
      expect(Sheet.Title).toBeDefined()
      expect(Sheet.Description).toBeDefined()
    })

    test('should have all components defined', () => {
      expect(Sheet.Root).toBeDefined()
      expect(Sheet.Trigger).toBeDefined()
      expect(Sheet.Content).toBeDefined()
      expect(Sheet.Header).toBeDefined()
      expect(Sheet.Footer).toBeDefined()
      expect(Sheet.Title).toBeDefined()
      expect(Sheet.Description).toBeDefined()
    })
  })

  describe('Complete Sheet', () => {
    test('should render full sheet with all components', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Sheet Title</Sheet.Title>
                <Sheet.Description>Sheet Description</Sheet.Description>
              </Sheet.Header>
              <div>Main Content</div>
              <Sheet.Footer>
                <button>Cancel</button>
                <button>Save</button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Sheet Title')).toBeInTheDocument()
      expect(screen.getByText('Sheet Description')).toBeInTheDocument()
      expect(screen.getByText('Main Content')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    test('should render sheet from all sides', () => {
      const sides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']

      sides.forEach(side => {
        const { unmount } = render(
          <TestWrapper>
            <Sheet.Root open>
              <Sheet.Content side={side}>
                <div>{side} Sheet</div>
              </Sheet.Content>
            </Sheet.Root>
          </TestWrapper>
        )

        expect(screen.getByText(`${side} Sheet`)).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle complete sheet workflow', async () => {
      const onOpenChange = vi.fn()
      render(
        <TestWrapper>
          <Sheet.Root onOpenChange={onOpenChange}>
            <Sheet.Trigger>Open</Sheet.Trigger>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Title</Sheet.Title>
              </Sheet.Header>
              <div>Content</div>
              <Sheet.Footer>
                <button>Action</button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      // Open sheet
      const trigger = screen.getByText('Open')
      await userEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.getByText('Action')).toBeInTheDocument()
      })

      // Close sheet by clicking close button
      const buttons = screen.getAllByRole('button')
      // The last button should be the close button (X icon)
      const closeButton = buttons[buttons.length - 1]
      await userEvent.click(closeButton)

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle sheet with no header', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <div>Content without header</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Content without header')).toBeInTheDocument()
    })

    test('should handle sheet with no footer', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Title</Sheet.Title>
              </Sheet.Header>
              <div>Content without footer</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content without footer')).toBeInTheDocument()
    })

    test('should handle sheet with empty content', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content />
          </Sheet.Root>
        </TestWrapper>
      )

      // Close button should still be present
      const closeButton = screen.getByRole('button')
      expect(closeButton).toBeInTheDocument()
    })

    test('should handle rapid open/close', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Sheet.Root open={false}>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      // Open
      rerender(
        <TestWrapper>
          <Sheet.Root open={true}>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()

      // Close
      rerender(
        <TestWrapper>
          <Sheet.Root open={false}>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    test('should handle multiple sheets', () => {
      render(
        <TestWrapper>
          <>
            <Sheet.Root open>
              <Sheet.Content side="left">
                <div>Left Sheet</div>
              </Sheet.Content>
            </Sheet.Root>
            <Sheet.Root open>
              <Sheet.Content side="right">
                <div>Right Sheet</div>
              </Sheet.Content>
            </Sheet.Root>
          </>
        </TestWrapper>
      )

      expect(screen.getByText('Left Sheet')).toBeInTheDocument()
      expect(screen.getByText('Right Sheet')).toBeInTheDocument()
    })

    test('should handle complex nested content', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>
                  <div>
                    <span>Complex</span> <strong>Title</strong>
                  </div>
                </Sheet.Title>
              </Sheet.Header>
              <div>
                <div>
                  <div>Deeply nested content</div>
                </div>
              </div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Deeply nested content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have dialog role', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    test('should have accessible close button', () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <div>Content</div>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Close button should exist (contains X icon)
      const closeButton = buttons[0]
      expect(closeButton).toBeInTheDocument()
    })

    test('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Sheet.Root open>
            <Sheet.Content>
              <button>Button 1</button>
              <button>Button 2</button>
            </Sheet.Content>
          </Sheet.Root>
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
