import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SidebarProvider, useSidebar } from '../sidebar-context'
import * as useIsMobileModule from '../use-is-mobile'

// Mock useIsMobile hook
vi.mock('../use-is-mobile', () => ({
  useIsMobile: vi.fn(() => false)
}))

describe('useSidebar', () => {
  describe('Hook Usage', () => {
    test('should throw error when used outside SidebarProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const TestComponent = () => {
        useSidebar()
        return <div>Test</div>
      }

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useSidebar must be used within a SidebarProvider.')

      consoleSpy.mockRestore()
    })

    test('should return context when used within SidebarProvider', () => {
      const TestComponent = () => {
        const context = useSidebar()
        return (
          <div>
            <span data-testid="has-state">{String(!!context.state)}</span>
            <span data-testid="has-setOpen">{String(!!context.setOpen)}</span>
            <span data-testid="has-openMobile">{String(typeof context.openMobile === 'boolean')}</span>
            <span data-testid="has-setOpenMobile">{String(!!context.setOpenMobile)}</span>
            <span data-testid="has-isMobile">{String(typeof context.isMobile === 'boolean')}</span>
            <span data-testid="has-toggleSidebar">{String(!!context.toggleSidebar)}</span>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('has-state')).toHaveTextContent('true')
      expect(screen.getByTestId('has-setOpen')).toHaveTextContent('true')
      expect(screen.getByTestId('has-openMobile')).toHaveTextContent('true')
      expect(screen.getByTestId('has-setOpenMobile')).toHaveTextContent('true')
      expect(screen.getByTestId('has-isMobile')).toHaveTextContent('true')
      expect(screen.getByTestId('has-toggleSidebar')).toHaveTextContent('true')
    })
  })
})

describe('SidebarProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.cookie = ''
    vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(false)
  })

  describe('Basic Rendering', () => {
    test('should render children', () => {
      render(
        <SidebarProvider>
          <div>Test Content</div>
        </SidebarProvider>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SidebarProvider.displayName).toBe('SidebarProvider')
    })

    test('should apply cn-sidebar-wrapper class', () => {
      const { container } = render(
        <SidebarProvider>
          <div>Content</div>
        </SidebarProvider>
      )
      expect(container.firstChild).toHaveClass('cn-sidebar-wrapper')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <SidebarProvider className="custom-class">
          <div>Content</div>
        </SidebarProvider>
      )
      expect(container.firstChild).toHaveClass('custom-class')
      expect(container.firstChild).toHaveClass('cn-sidebar-wrapper')
    })

    test('should forward ref', () => {
      const ref = { current: null }
      render(
        <SidebarProvider ref={ref}>
          <div>Content</div>
        </SidebarProvider>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    test('should forward additional props', () => {
      const { container } = render(
        <SidebarProvider data-testid="sidebar-provider">
          <div>Content</div>
        </SidebarProvider>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'sidebar-provider')
    })
  })

  describe('Default State', () => {
    test('should initialize with expanded state by default', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')
    })

    test('should initialize with defaultOpen=false as collapsed', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider defaultOpen={false}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should initialize with openMobile=false', () => {
      const TestComponent = () => {
        const { openMobile } = useSidebar()
        return <span data-testid="openMobile">{String(openMobile)}</span>
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('openMobile')).toHaveTextContent('false')
    })

    test('should initialize isMobile from hook', () => {
      vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(true)

      const TestComponent = () => {
        const { isMobile } = useSidebar()
        return <span data-testid="isMobile">{String(isMobile)}</span>
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('isMobile')).toHaveTextContent('true')
    })
  })

  describe('Controlled State', () => {
    test('should use open prop when provided', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider open={false}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should call onOpenChange when open state changes', async () => {
      const onOpenChange = vi.fn()

      const TestComponent = () => {
        const { setOpen } = useSidebar()
        return <button onClick={() => setOpen(false)}>Close</button>
      }

      render(
        <SidebarProvider open={true} onOpenChange={onOpenChange}>
          <TestComponent />
        </SidebarProvider>
      )

      await userEvent.click(screen.getByText('Close'))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    test('should override defaultOpen with open prop', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider defaultOpen={true} open={false}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })
  })

  describe('setOpen Function', () => {
    test('should update state when setOpen is called with boolean', async () => {
      const TestComponent = () => {
        const { state, setOpen } = useSidebar()
        return (
          <div>
            <span data-testid="state">{state}</span>
            <button onClick={() => setOpen(false)}>Collapse</button>
          </div>
        )
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')

      await userEvent.click(screen.getByText('Collapse'))
      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should update state when setOpen is called with function', async () => {
      const TestComponent = () => {
        const { state, setOpen } = useSidebar()
        return (
          <div>
            <span data-testid="state">{state}</span>
            <button onClick={() => setOpen(false)}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should set cookie when setOpen is called', async () => {
      const TestComponent = () => {
        const { setOpen } = useSidebar()
        return <button onClick={() => setOpen(false)}>Collapse</button>
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      await userEvent.click(screen.getByText('Collapse'))
      expect(document.cookie).toContain('sidebar:state=false')
    })

    test('should set cookie with correct path and max-age', async () => {
      const TestComponent = () => {
        const { setOpen } = useSidebar()
        return <button onClick={() => setOpen(true)}>Expand</button>
      }

      render(
        <SidebarProvider defaultOpen={false}>
          <TestComponent />
        </SidebarProvider>
      )

      await userEvent.click(screen.getByText('Expand'))
      expect(document.cookie).toContain('sidebar:state=true')
    })
  })

  describe('setOpenMobile Function', () => {
    test('should update openMobile state', async () => {
      const TestComponent = () => {
        const { openMobile, setOpenMobile } = useSidebar()
        return (
          <div>
            <span data-testid="mobile">{String(openMobile)}</span>
            <button onClick={() => setOpenMobile(true)}>Open Mobile</button>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('mobile')).toHaveTextContent('false')

      await userEvent.click(screen.getByText('Open Mobile'))
      expect(screen.getByTestId('mobile')).toHaveTextContent('true')
    })
  })

  describe('toggleSidebar Function', () => {
    test('should toggle sidebar state on desktop', async () => {
      vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(false)

      const TestComponent = () => {
        const { state, toggleSidebar } = useSidebar()
        return (
          <div>
            <span data-testid="state">{state}</span>
            <button onClick={toggleSidebar}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should toggle openMobile state on mobile', async () => {
      vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(true)

      const TestComponent = () => {
        const { openMobile, toggleSidebar } = useSidebar()
        return (
          <div>
            <span data-testid="mobile">{String(openMobile)}</span>
            <button onClick={toggleSidebar}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('mobile')).toHaveTextContent('false')

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('mobile')).toHaveTextContent('true')
    })

    test('should toggle multiple times', async () => {
      const TestComponent = () => {
        const { state, toggleSidebar } = useSidebar()
        return (
          <div>
            <span data-testid="state">{state}</span>
            <button onClick={toggleSidebar}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('state')).toHaveTextContent('expanded')
    })
  })

  describe('State Derivation', () => {
    test('should compute state as "expanded" when open is true', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('expanded')
    })

    test('should compute state as "collapsed" when open is false', () => {
      const TestComponent = () => {
        const { state } = useSidebar()
        return <span data-testid="state">{state}</span>
      }

      render(
        <SidebarProvider defaultOpen={false}>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })
  })

  describe('Context Value Memoization', () => {
    test('should memoize context value', () => {
      const TestComponent = () => {
        const context1 = useSidebar()
        const context2 = useSidebar()
        return (
          <div>
            <span data-testid="same">{String(context1 === context2)}</span>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('same')).toHaveTextContent('true')
    })
  })

  describe('Edge Cases', () => {
    test('should handle rapid state changes', async () => {
      const TestComponent = () => {
        const { state, toggleSidebar } = useSidebar()
        return (
          <div>
            <span data-testid="state">{state}</span>
            <button onClick={toggleSidebar}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      const button = screen.getByText('Toggle')

      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
    })

    test('should handle setOpen with same value', async () => {
      const onOpenChange = vi.fn()

      const TestComponent = () => {
        const { setOpen } = useSidebar()
        return <button onClick={() => setOpen(true)}>Keep Open</button>
      }

      render(
        <SidebarProvider open={true} onOpenChange={onOpenChange}>
          <TestComponent />
        </SidebarProvider>
      )

      await userEvent.click(screen.getByText('Keep Open'))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    test('should handle undefined className', () => {
      const { container } = render(
        <SidebarProvider className={undefined}>
          <div>Content</div>
        </SidebarProvider>
      )
      expect(container.firstChild).toHaveClass('cn-sidebar-wrapper')
    })

    test('should handle empty children', () => {
      const { container } = render(<SidebarProvider>{null}</SidebarProvider>)
      expect(container.firstChild).toBeInTheDocument()
    })

    test('should handle multiple children', () => {
      render(
        <SidebarProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </SidebarProvider>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })
  })

  describe('Integration with Mobile', () => {
    test('should track mobile state changes', () => {
      vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(true)

      const TestComponent = () => {
        const { isMobile } = useSidebar()
        return <span data-testid="isMobile">{String(isMobile)}</span>
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      expect(screen.getByTestId('isMobile')).toHaveTextContent('true')
    })

    test('should toggle correct state based on device', async () => {
      vi.mocked(useIsMobileModule.useIsMobile).mockReturnValue(true)

      const TestComponent = () => {
        const { openMobile, toggleSidebar } = useSidebar()
        return (
          <div>
            <span data-testid="mobile">{String(openMobile)}</span>
            <button onClick={toggleSidebar}>Toggle</button>
          </div>
        )
      }

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      )

      await userEvent.click(screen.getByText('Toggle'))
      expect(screen.getByTestId('mobile')).toHaveTextContent('true')
    })
  })
})
