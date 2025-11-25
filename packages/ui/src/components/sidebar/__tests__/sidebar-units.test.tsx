import { forwardRef } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarRoot,
  SidebarSeparator,
  SidebarTrigger
} from '../sidebar-units'

// Shared mocks
let sidebarState = {
  isMobile: false,
  state: 'expanded' as 'expanded' | 'collapsed',
  openMobile: false,
  setOpenMobile: vi.fn(),
  toggleSidebar: vi.fn()
}

vi.mock('../sidebar-context', () => ({
  useSidebar: () => sidebarState,
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

vi.mock('@utils/cn', () => ({
  cn: (...classes: any[]) =>
    classes
      .flatMap(value => {
        if (!value) return []
        if (typeof value === 'string') return value
        if (Array.isArray(value)) return value
        if (typeof value === 'object') {
          return Object.entries(value)
            .filter(([, condition]) => Boolean(condition))
            .map(([key]) => key)
        }
        return []
      })
      .join(' ')
}))

vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback
  })
}))

const mockUseScrollArea = vi.fn((_props?: any) => ({
  isTop: false,
  isBottom: false,
  onScrollTop: vi.fn(),
  onScrollBottom: vi.fn()
}))
vi.mock('@/components', () => {
  const mockButton = forwardRef<HTMLButtonElement, any>(({ children, onClick, tooltipProps, ...props }, ref) => (
    <button data-testid="button" ref={ref} data-tooltip={tooltipProps?.content} onClick={onClick} {...props}>
      {children}
    </button>
  ))
  mockButton.displayName = 'MockButton'

  const mockIcon = ({ name }: any) => <span data-testid="icon" data-name={name} />
  const mockText = ({ children, className, color, onMouseEnter, onMouseLeave, ...props }: any) => (
    <span
      data-testid="text"
      className={className}
      data-color={color}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </span>
  )

  const mockHorizontal = ({ children, className, ...props }: any) => (
    <div data-testid="layout-horizontal" className={className} {...props}>
      {children}
    </div>
  )

  const mockScrollArea = vi.fn((props: any) => <div data-testid="scroll-area" {...props} />)

  const sheetRoot = ({ children, open, onOpenChange }: any) => (
    <button type="button" data-testid="sheet-root" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </button>
  )
  const sheetContent = ({ children, side, ...props }: any) => (
    <div data-testid="sheet-content" data-side={side} {...props}>
      {children}
    </div>
  )

  const separator = forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
    <div data-testid="separator" ref={ref} className={className} {...props} />
  ))
  separator.displayName = 'Separator'

  return {
    Button: mockButton,
    IconV2: mockIcon,
    Layout: {
      Horizontal: mockHorizontal
    },
    ScrollArea: mockScrollArea,
    Separator: separator,
    Sheet: {
      Root: sheetRoot,
      Content: sheetContent
    },
    Text: mockText,
    useScrollArea: (props: any) => mockUseScrollArea(props)
  }
})

const renderWith = (ui: React.ReactElement) => render(ui)

describe('SidebarRoot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sidebarState = {
      isMobile: false,
      state: 'expanded',
      openMobile: false,
      setOpenMobile: vi.fn(),
      toggleSidebar: vi.fn()
    }
  })

  test('renders desktop variant with data attributes', () => {
    const { container } = renderWith(
      <SidebarRoot side="right" className="custom">
        <span>Content</span>
      </SidebarRoot>
    )

    const outer = container.firstChild as HTMLElement
    expect(outer).toHaveAttribute('data-side', 'right')
    expect(outer).toHaveAttribute('data-state', 'expanded')

    const inner = outer.querySelector('.cn-sidebar-desktop') as HTMLElement
    expect(inner).toHaveClass('custom')
    expect(inner.textContent).toContain('Content')
  })

  test('renders mobile sheet when isMobile true', () => {
    sidebarState.isMobile = true
    sidebarState.openMobile = true

    renderWith(
      <SidebarRoot side="left">
        <span>Mobile</span>
      </SidebarRoot>
    )

    expect(screen.getByTestId('sheet-root')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('sheet-content')).toHaveAttribute('data-side', 'left')
  })
})

describe('SidebarTrigger', () => {
  test('calls toggleSidebar and onClick', async () => {
    const onClick = vi.fn()

    renderWith(<SidebarTrigger onClick={onClick} />)

    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-tooltip', 'Toggle sidebar')

    await userEvent.click(button)

    expect(onClick).toHaveBeenCalled()
    expect(sidebarState.toggleSidebar).toHaveBeenCalled()
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'sidebar')
  })
})

describe('SidebarRail', () => {
  beforeEach(() => {
    sidebarState.toggleSidebar.mockClear()
  })

  test('toggles sidebar and forwards click', async () => {
    const onClick = vi.fn()
    renderWith(<SidebarRail open={true} onClick={onClick} />)

    const button = screen.getByRole('button')

    // initial aria-label
    expect(button).toHaveAttribute('aria-label', 'Collapse')

    // click button
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalled()
    expect(sidebarState.toggleSidebar).toHaveBeenCalled()
  })

  test('updates indicator on hover state', async () => {
    renderWith(<SidebarRail open={false} />)
    const button = screen.getByRole('button')

    // select inner div that handles hover
    const indicator = button.querySelector('.absolute') as HTMLElement
    expect(indicator).toBeInTheDocument()

    // Initial state
    expect(indicator.textContent).toBe('|')

    // Hover over the inner div
    await userEvent.hover(indicator)

    // Wait for the icon to appear
    await waitFor(() => {
      const icon = indicator.querySelector('[data-name="nav-arrow-right"]')
      expect(icon).toBeInTheDocument()
    })

    // Unhover
    await userEvent.unhover(indicator)
    expect(indicator.textContent).toBe('|')
  })
})

describe('Simple wrappers', () => {
  test.each([
    [SidebarInset, 'cn-sidebar-inset'],
    [SidebarHeader, 'cn-sidebar-header'],
    [SidebarFooter, 'cn-sidebar-footer']
  ])('%s merges className', (Component, baseClass) => {
    renderWith(<Component className="extra">Content</Component>)
    const element = screen.getByText('Content')
    expect(element).toHaveClass(baseClass)
    expect(element).toHaveClass('extra')
  })

  test('SidebarSeparator merges className', () => {
    renderWith(<SidebarSeparator className="extra" />)
    expect(screen.getByTestId('separator')).toHaveClass('cn-sidebar-separator')
    expect(screen.getByTestId('separator')).toHaveClass('extra')
  })
})

describe('SidebarContent', () => {
  beforeEach(() => {
    mockUseScrollArea.mockReturnValue({
      isTop: false,
      isBottom: false,
      onScrollTop: vi.fn(),
      onScrollBottom: vi.fn()
    })
  })

  test('renders wrapper and scroll area', () => {
    renderWith(
      <SidebarContent className="extra" data-testid="content">
        <div>Body</div>
      </SidebarContent>
    )

    const wrapper = document.querySelector('.cn-sidebar-content-wrapper') as HTMLElement
    expect(wrapper).toHaveClass('extra')
    expect(screen.getByTestId('content')).toHaveAttribute('role', 'menu')
  })

  test('applies top and bottom classes from hook', () => {
    mockUseScrollArea.mockReturnValue({
      isTop: true,
      isBottom: true,
      onScrollTop: vi.fn(),
      onScrollBottom: vi.fn()
    })

    renderWith(
      <SidebarContent>
        <div>Body</div>
      </SidebarContent>
    )

    const wrapper = document.querySelector('.cn-sidebar-content-wrapper') as HTMLElement
    expect(wrapper).toHaveClass('cn-sidebar-content-wrapper-top')
    expect(wrapper).toHaveClass('cn-sidebar-content-wrapper-bottom')
  })
})

describe('SidebarGroup', () => {
  test('renders label and children', () => {
    renderWith(
      <SidebarGroup label="Section">
        <div>Child</div>
      </SidebarGroup>
    )

    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  test('renders action button with custom icon', async () => {
    const onAction = vi.fn()
    renderWith(
      <SidebarGroup label="Section" actionIcon="menu" onActionClick={onAction}>
        <div />
      </SidebarGroup>
    )

    const button = screen.getByTestId('button')
    await userEvent.click(button)
    expect(onAction).toHaveBeenCalled()
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'menu')
  })
})

describe('SidebarMenuSkeleton', () => {
  const originalRandom = Math.random

  beforeEach(() => {
    Math.random = vi.fn(() => 0.5)
    sidebarState.state = 'expanded'
  })

  afterEach(() => {
    Math.random = originalRandom
  })

  test('renders icon and text by default', () => {
    renderWith(<SidebarMenuSkeleton />)
    expect(document.querySelector('.cn-sidebar-item-skeleton-icon')).toBeInTheDocument()
    const text = document.querySelector('.cn-sidebar-item-skeleton-text') as HTMLElement
    expect(text.style.getPropertyValue('--cn-sidebar-skeleton-width')).toBe('70%')
  })

  test('hides text when collapsed', () => {
    sidebarState.state = 'collapsed'
    renderWith(<SidebarMenuSkeleton hideIcon />)
    // Icon should still render when collapsed even if hideIcon true
    expect(document.querySelector('.cn-sidebar-item-skeleton-icon')).toBeInTheDocument()
    expect(document.querySelector('.cn-sidebar-item-skeleton-text')).toBeNull()
  })
})
