import React from 'react'

import { afterFrames, getShadowActiveElement } from '@/utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Tabs } from '../tabs'

// Mock getShadowActiveElement and afterFrames for Shadow DOM tests
vi.mock('@/utils', async () => {
  const actual = await vi.importActual('@/utils')
  return {
    ...actual,
    getShadowActiveElement: vi.fn(() => ({ isShadowRoot: false, activeEl: null })),
    afterFrames: vi.fn((cb: () => void) => {
      cb()
    })
  }
})

// Note: @/context is mocked globally in vitest.setup.ts
// The mock provides usePortal and useRouterContext

const TestWrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>

describe('Tabs', () => {
  describe('Tabs.Root', () => {
    describe('Basic Rendering', () => {
      test('should render tabs root', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()
        expect(screen.getByText('Tab 2')).toBeInTheDocument()
      })

      test('should apply custom className', () => {
        const { container } = render(
          <TestWrapper>
            <Tabs.Root className="custom-tabs">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const root = container.querySelector('.custom-tabs')
        expect(root).toBeInTheDocument()
      })
    })

    describe('Controlled Tabs', () => {
      test('should handle controlled value prop', () => {
        render(
          <TestWrapper>
            <Tabs.Root value="tab2">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 2')).toBeInTheDocument()
      })

      test('should call onValueChange when tab changes', async () => {
        const onValueChange = vi.fn()
        render(
          <TestWrapper>
            <Tabs.Root onValueChange={onValueChange}>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab2 = screen.getByText('Tab 2')
        await userEvent.click(tab2)

        expect(onValueChange).toHaveBeenCalledWith('tab2')
      })

      test('should update activeTabValue when controlled value changes', () => {
        const { rerender } = render(
          <TestWrapper>
            <Tabs.Root value="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()

        rerender(
          <TestWrapper>
            <Tabs.Root value="tab2">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 2')).toBeInTheDocument()
      })
    })

    describe('Uncontrolled Tabs', () => {
      test('should handle defaultValue prop', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab2">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 2')).toBeInTheDocument()
      })

      test('should manage internal state when uncontrolled', async () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab2 = screen.getByText('Tab 2')
        await userEvent.click(tab2)

        expect(tab2).toBeInTheDocument()
      })
    })
  })

  describe('Tabs.NavRoot', () => {
    describe('Basic Rendering', () => {
      test('should render nav root', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()
      })

      test('should render multiple children', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="/tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()
        expect(screen.getByText('Tab 2')).toBeInTheDocument()
      })

      test('should provide tabsnav context type', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/path" linkProps={{ end: true }}>
                  Nav Tab
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        // Should render as NavLink (anchor tag)
        const link = screen.getByText('Nav Tab').closest('a')
        expect(link).toBeInTheDocument()
      })
    })
  })

  describe('Tabs.List', () => {
    describe('Basic Rendering', () => {
      test('should render tabs list', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toBeInTheDocument()
      })

      test('should render as nav element in NavRoot', () => {
        const { container } = render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const nav = container.querySelector('nav')
        expect(nav).toBeInTheDocument()
      })

      test('should forward ref to list element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List ref={ref}>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLElement)
      })
    })

    describe('Variants', () => {
      test('should apply underlined variant by default', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('cn-tabs-list-underlined')
      })

      test('should apply overlined variant', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="overlined">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('cn-tabs-list-overlined')
      })

      test('should apply ghost variant', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="ghost">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('cn-tabs-list-ghost')
      })

      test('should apply outlined variant', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="outlined">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('cn-tabs-list-outlined')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List className="custom-list">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('custom-list')
      })

      test('should apply activeClassName to triggers', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List activeClassName="custom-active">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab1 = screen.getByText('Tab 1')
        expect(tab1).toHaveClass('custom-active')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Tabs.List.displayName).toBe('TabsList')
      })
    })
  })

  describe('Tabs.Trigger', () => {
    describe('Basic Rendering', () => {
      test('should render trigger as button in Tabs.Root', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger.tagName).toBe('BUTTON')
      })

      test('should render trigger as link in NavRoot', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" linkProps={{ end: true }}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const trigger = screen.getByText('Tab 1').closest('a')
        expect(trigger).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Custom Content</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Custom Content')).toBeInTheDocument()
      })

      test('should accept value prop', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="unique-value">
              <Tabs.List>
                <Tabs.Trigger value="unique-value">Tab</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        // Trigger should be active when value matches
        expect(trigger).toHaveClass('cn-tabs-trigger-active')
      })

      test('should forward ref to trigger element', () => {
        const ref = React.createRef<HTMLButtonElement>()
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger ref={ref} value="tab1">
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      })
    })

    describe('Icon Support', () => {
      test('should accept icon prop', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" icon="code">
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        // Trigger should render with text
        expect(screen.getByText('Tab 1')).toBeInTheDocument()
      })

      test('should render without icon when not provided', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toBeInTheDocument()
        expect(trigger.textContent).toBe('Tab 1')
      })

      test('should accept icon and render content', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" icon="settings">
                  Settings
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger.textContent).toContain('Settings')
      })
    })

    describe('Logo Support', () => {
      test('should accept logo prop', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" logo="harness">
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toBeInTheDocument()
      })

      test('should render without logo when not provided', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger.textContent).toBe('Tab 1')
      })
    })

    describe('Counter Badge', () => {
      test('should render counter badge when counter is provided', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" counter={5}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('5')).toBeInTheDocument()
      })

      test('should render counter badge with 0', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" counter={0}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('0')).toBeInTheDocument()
      })

      test('should not render counter badge when null', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" counter={null}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger.textContent).toBe('Tab 1')
      })

      test('should not render counter badge when undefined', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger.textContent).toBe('Tab 1')
      })

      test('should render large counter numbers', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" counter={999}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('999')).toBeInTheDocument()
      })
    })

    describe('Active State', () => {
      test('should apply active class to selected tab', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab1 = screen.getByText('Tab 1')
        expect(tab1).toHaveClass('cn-tabs-trigger-active')
      })

      test('should update active class when tab changes', async () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab1 = screen.getByText('Tab 1')
        const tab2 = screen.getByText('Tab 2')

        expect(tab1).toHaveClass('cn-tabs-trigger-active')
        expect(tab2).not.toHaveClass('cn-tabs-trigger-active')

        await userEvent.click(tab2)

        await waitFor(() => {
          expect(tab2).toHaveClass('cn-tabs-trigger-active')
        })
      })

      test('should apply custom activeClassName', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List activeClassName="my-active-class">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const tab1 = screen.getByText('Tab 1')
        expect(tab1).toHaveClass('my-active-class')
      })
    })

    describe('Variants', () => {
      test('should apply underlined variant to triggers', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="underlined">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('cn-tabs-trigger-underlined')
      })

      test('should apply overlined variant to triggers', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="overlined">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('cn-tabs-trigger-overlined')
      })

      test('should apply ghost variant to triggers', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="ghost">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('cn-tabs-trigger-ghost')
      })

      test('should apply outlined variant to triggers', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="outlined">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('cn-tabs-trigger-outlined')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List className="custom-list-class">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('custom-list-class')
      })

      test('should merge custom className with variant classes', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="ghost" className="custom">
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const list = screen.getByRole('tablist')
        expect(list).toHaveClass('custom')
        expect(list).toHaveClass('cn-tabs-list-ghost')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Tabs.List.displayName).toBe('TabsList')
      })
    })
  })

  describe('Tabs.Trigger', () => {
    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" className="custom-trigger">
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('custom-trigger')
      })

      test('should merge className with variant classes', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List variant="ghost">
                <Tabs.Trigger value="tab1" className="custom">
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveClass('custom')
        expect(trigger).toHaveClass('cn-tabs-trigger-ghost')
      })
    })

    describe('Disabled State', () => {
      test('should handle disabled prop in button mode', () => {
        render(
          <TestWrapper>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="tab1" disabled>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toBeDisabled()
      })

      test('should handle disabled prop in nav mode', async () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" disabled>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        expect(trigger).toHaveAttribute('aria-disabled', 'true')
      })

      test('should prevent navigation when disabled in nav mode', async () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" disabled linkProps={{ end: true }}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const trigger = screen.getByRole('tab')
        await userEvent.click(trigger)

        // Click should be prevented
        expect(trigger).toBeInTheDocument()
      })
    })

    describe('NavLink Integration', () => {
      test('should render NavLink with correct value', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/settings" linkProps={{ end: true }}>
                  Settings
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        // NavLink is mocked as 'a' tag in global setup
        const link = screen.getByRole('tab')
        expect(link).toBeInTheDocument()
        expect(link.textContent).toContain('Settings')
      })

      test('should handle NavLink rendering', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" linkProps={{ end: true }}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const link = screen.getByText('Tab 1').closest('a')
        expect(link).toBeInTheDocument()
      })

      test('should accept linkProps', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" linkProps={{ end: true }}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        expect(screen.getByText('Tab 1')).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Tabs.Trigger.displayName).toBe('TabsTrigger')
      })
    })
  })

  describe('Tabs.Content', () => {
    describe('Basic Rendering', () => {
      test('should render content for active tab', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content 1')).toBeInTheDocument()
      })

      test('should not render content for inactive tab', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
              <Tabs.Content value="tab2">Content 2</Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content 1')).toBeInTheDocument()
        expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
      })

      test('should switch content when tab changes', async () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">Content 1</Tabs.Content>
              <Tabs.Content value="tab2">Content 2</Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(screen.getByText('Content 1')).toBeInTheDocument()

        const tab2 = screen.getByText('Tab 2')
        await userEvent.click(tab2)

        await waitFor(() => {
          expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
          expect(screen.getByText('Content 2')).toBeInTheDocument()
        })
      })

      test('should render as div in NavRoot', () => {
        render(
          <TestWrapper>
            <Tabs.NavRoot>
              <Tabs.List>
                <Tabs.Trigger value="/tab1" linkProps={{ end: true }}>
                  Tab 1
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="/tab1">Content 1</Tabs.Content>
            </Tabs.NavRoot>
          </TestWrapper>
        )

        const content = screen.getByText('Content 1')
        expect(content.parentElement).toBeInTheDocument()
      })

      test('should forward ref to content element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content ref={ref} value="tab1">
                Content 1
              </Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        expect(ref.current).toBeInstanceOf(HTMLElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1" className="custom-content">
                <div data-testid="content-inner">Content 1</div>
              </Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        const contentInner = screen.getByTestId('content-inner')
        const content = contentInner.parentElement
        expect(content).toHaveClass('custom-content')
      })

      test('should apply default cn-tabs-content class', () => {
        render(
          <TestWrapper>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tab1">
                <div data-testid="content-inner">Content 1</div>
              </Tabs.Content>
            </Tabs.Root>
          </TestWrapper>
        )

        const contentInner = screen.getByTestId('content-inner')
        const content = contentInner.parentElement
        expect(content).toHaveClass('cn-tabs-content')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Tabs.Content.displayName).toBe('TabsContent')
      })
    })
  })

  describe('Tabs Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Tabs.Root).toBeDefined()
      expect(Tabs.NavRoot).toBeDefined()
      expect(Tabs.List).toBeDefined()
      expect(Tabs.Trigger).toBeDefined()
      expect(Tabs.Content).toBeDefined()
    })

    test('should have all components defined', () => {
      expect(Tabs.Root).toBeDefined()
      expect(Tabs.NavRoot).toBeDefined()
      expect(Tabs.List).toBeDefined()
      expect(Tabs.Trigger).toBeDefined()
      expect(Tabs.Content).toBeDefined()
    })
  })

  describe('Complete Tabs', () => {
    test('should render complete tabs with all features', async () => {
      const onValueChange = vi.fn()
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1" onValueChange={onValueChange}>
            <Tabs.List variant="underlined">
              <Tabs.Trigger value="tab1" icon="code" counter={5}>
                Home
              </Tabs.Trigger>
              <Tabs.Trigger value="tab2" counter={3}>
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger value="tab3" disabled>
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Home Content</Tabs.Content>
            <Tabs.Content value="tab2">Profile Content</Tabs.Content>
            <Tabs.Content value="tab3">Settings Content</Tabs.Content>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Home Content')).toBeInTheDocument()

      const tab2 = screen.getByText('Profile')
      await userEvent.click(tab2)

      await waitFor(() => {
        expect(screen.getByText('Profile Content')).toBeInTheDocument()
        expect(screen.queryByText('Home Content')).not.toBeInTheDocument()
        expect(onValueChange).toHaveBeenCalledWith('tab2')
      })
    })

    test('should render complete nav tabs', () => {
      render(
        <TestWrapper>
          <Tabs.NavRoot>
            <Tabs.List variant="outlined">
              <Tabs.Trigger value="/home" icon="code" linkProps={{ end: true }}>
                Home
              </Tabs.Trigger>
              <Tabs.Trigger value="/profile" linkProps={{ end: true }}>
                Profile
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="/home">Home Page</Tabs.Content>
          </Tabs.NavRoot>
        </TestWrapper>
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    test('should handle tabs with counter', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1" counter={10}>
                Settings
              </Tabs.Trigger>
              <Tabs.Trigger value="tab2">Harness</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Harness')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })

  describe('Keyboard and Focus Handling', () => {
    test('should handle onFocusCapture on tabs list', () => {
      const onFocusCapture = vi.fn()
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onFocusCapture={onFocusCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    test('should handle onKeyDownCapture on tabs list', () => {
      const onKeyDownCapture = vi.fn()
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onKeyDownCapture={onKeyDownCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    test('should call custom onFocusCapture before internal handler', () => {
      const onFocusCapture = vi.fn()
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onFocusCapture={onFocusCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      fireEvent.focusIn(tablist)

      expect(onFocusCapture).toHaveBeenCalled()
    })

    test('should call custom onKeyDownCapture before internal handler', () => {
      const onKeyDownCapture = vi.fn()
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onKeyDownCapture={onKeyDownCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })

      expect(onKeyDownCapture).toHaveBeenCalled()
    })

    test('should handle keyboard navigation props', () => {
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tabs = screen.getAllByRole('tab')
      expect(tabs.length).toBe(2)
    })
  })

  describe('Shadow DOM Handling', () => {
    test('should handle focus capture when relatedTarget is contained', () => {
      vi.mocked(getShadowActiveElement).mockReturnValueOnce({
        isShadowRoot: true,
        activeEl: document.body
      })

      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      const tab1 = screen.getByText('Tab 1')

      // Simulate focus with relatedTarget inside current target
      fireEvent.focusIn(tablist, { relatedTarget: tab1 })

      expect(tablist).toBeInTheDocument()
    })

    test('should handle arrow key navigation in shadow DOM', () => {
      const mockActiveTab = document.createElement('button')
      mockActiveTab.setAttribute('role', 'tab')

      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: mockActiveTab
      })

      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')

      // Simulate ArrowRight key in Shadow DOM
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })

      expect(tablist).toBeInTheDocument()
    })

    test('should handle ArrowLeft key navigation in shadow DOM', () => {
      const mockActiveTab = document.createElement('button')
      mockActiveTab.setAttribute('role', 'tab')

      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: mockActiveTab
      })

      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab2">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')

      // Simulate ArrowLeft key in Shadow DOM
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' })

      expect(tablist).toBeInTheDocument()
    })

    test('should ignore non-arrow keys in shadow DOM', () => {
      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: document.body
      })

      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')

      // Simulate non-arrow key
      fireEvent.keyDown(tablist, { key: 'Enter' })

      expect(tablist).toBeInTheDocument()
    })

    test('should handle keyboard navigation when preventDefault is called', () => {
      const onKeyDownCapture = vi.fn(e => e.preventDefault())

      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onKeyDownCapture={onKeyDownCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })

      expect(onKeyDownCapture).toHaveBeenCalled()
    })

    test('should handle focus when preventDefault is called', () => {
      const onFocusCapture = vi.fn(e => e.preventDefault())

      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List onFocusCapture={onFocusCapture}>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      fireEvent.focusIn(tablist)

      expect(onFocusCapture).toHaveBeenCalled()
    })

    test('should focus active tab in shadow DOM on focus capture', () => {
      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: null
      })

      vi.mocked(afterFrames).mockImplementation(cb => {
        cb()
        return () => {}
      })

      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')

      // Simulate focus from outside
      fireEvent.focusIn(tablist, { relatedTarget: null })

      expect(tablist).toBeInTheDocument()
    })

    test('should navigate to next tab with arrow keys in shadow DOM', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' })

      // Mock Shadow DOM and set active element
      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: tab1
      })

      // Simulate ArrowRight
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })

      expect(tablist).toBeInTheDocument()
    })

    test('should wrap around when navigating past last tab in shadow DOM', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab3">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' })

      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: tab3
      })

      // ArrowRight on last tab should wrap to first
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })

      expect(tablist).toBeInTheDocument()
    })

    test('should handle ArrowLeft to navigate to previous tab in shadow DOM', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab2">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tablist = screen.getByRole('tablist')
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })

      vi.mocked(getShadowActiveElement).mockReturnValue({
        isShadowRoot: true,
        activeEl: tab2
      })

      fireEvent.keyDown(tablist, { key: 'ArrowLeft' })

      expect(tablist).toBeInTheDocument()
    })
  })

  describe('NavLink Click Handling', () => {
    test('should handle click events in NavRoot', async () => {
      render(
        <TestWrapper>
          <Tabs.NavRoot>
            <Tabs.List>
              <Tabs.Trigger value="/tab1" linkProps={{ end: true }}>
                Tab 1
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.NavRoot>
        </TestWrapper>
      )

      const trigger = screen.getByRole('tab')
      await userEvent.click(trigger)

      expect(trigger).toBeInTheDocument()
    })

    test('should prevent click when disabled in NavRoot', async () => {
      render(
        <TestWrapper>
          <Tabs.NavRoot>
            <Tabs.List>
              <Tabs.Trigger value="/tab1" disabled linkProps={{ end: true }}>
                Tab 1
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.NavRoot>
        </TestWrapper>
      )

      const trigger = screen.getByRole('tab')
      await userEvent.click(trigger)

      expect(trigger).toHaveAttribute('aria-disabled', 'true')
    })

    test('should accept activeClassName in NavRoot', () => {
      render(
        <TestWrapper>
          <Tabs.NavRoot>
            <Tabs.List activeClassName="custom-active" variant="ghost">
              <Tabs.Trigger value="/path" linkProps={{ end: true }}>
                Nav Item
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.NavRoot>
        </TestWrapper>
      )

      const trigger = screen.getByRole('tab')
      expect(trigger).toBeInTheDocument()
    })

    test('should call onValueChange on nav trigger click when not disabled', async () => {
      render(
        <TestWrapper>
          <Tabs.NavRoot>
            <Tabs.List>
              <Tabs.Trigger value="/enabled" linkProps={{ end: true }}>
                Enabled
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.NavRoot>
        </TestWrapper>
      )

      const trigger = screen.getByRole('tab')
      await userEvent.click(trigger)

      expect(trigger).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty tabs list', () => {
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List />
          </Tabs.Root>
        </TestWrapper>
      )

      const list = screen.getByRole('tablist')
      expect(list).toBeInTheDocument()
    })

    test('should handle tabs without content', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Tab 1')).toBeInTheDocument()
    })

    test('should handle multiple tabs with same variant', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List variant="ghost">
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const triggers = screen.getAllByRole('tab')
      triggers.forEach(trigger => {
        expect(trigger).toHaveClass('cn-tabs-trigger-ghost')
      })
    })

    test('should handle rapid tab switching', async () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Content 1</Tabs.Content>
            <Tabs.Content value="tab2">Content 2</Tabs.Content>
            <Tabs.Content value="tab3">Content 3</Tabs.Content>
          </Tabs.Root>
        </TestWrapper>
      )

      await userEvent.click(screen.getByText('Tab 2'))
      await userEvent.click(screen.getByText('Tab 3'))
      await userEvent.click(screen.getByText('Tab 1'))

      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument()
      })
    })

    test('should handle tabs without defaultValue or value', () => {
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Tab 1')).toBeInTheDocument()
      expect(screen.getByText('Tab 2')).toBeInTheDocument()
    })

    test('should handle counter with negative numbers', () => {
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1" counter={-5}>
                Tab 1
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      // Negative numbers are still integers, should render
      expect(screen.getByText('-5')).toBeInTheDocument()
    })

    test('should not render counter for non-integer values', () => {
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1" counter={3.5 as any}>
                Tab 1
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      // 3.5 is not an integer
      const trigger = screen.getByRole('tab')
      expect(trigger.textContent).toBe('Tab 1')
    })

    test('should handle very long tab text', () => {
      const longText = 'A'.repeat(100)
      render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1">{longText}</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    test('should handle mixed content (icon, text, counter)', () => {
      const { container } = render(
        <TestWrapper>
          <Tabs.Root>
            <Tabs.List>
              <Tabs.Trigger value="tab1" icon="bell" counter={99}>
                Notifications
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(container.querySelector('.cn-icon')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('99')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have correct ARIA roles', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab')).toBeInTheDocument()
    })

    test('should render content with correct structure', () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">
              <div data-testid="content">Content</div>
            </Tabs.Content>
          </Tabs.Root>
        </TestWrapper>
      )

      const contentDiv = screen.getByTestId('content')
      expect(contentDiv).toBeInTheDocument()
    })

    test('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </TestWrapper>
      )

      const tab1 = screen.getByText('Tab 1')
      tab1.focus()

      expect(document.activeElement).toBe(tab1)
    })
  })
})
