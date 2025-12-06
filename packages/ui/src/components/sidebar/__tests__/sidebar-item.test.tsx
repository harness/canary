import { forwardRef, ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SidebarItem, SidebarItemProps, SidebarMenuSubItem } from '../sidebar-item'

// Mocks
const mockToggleSidebar = vi.fn()
let sidebarContext = {
  state: 'expanded' as 'expanded' | 'collapsed',
  setOpen: vi.fn(),
  openMobile: false,
  setOpenMobile: vi.fn(),
  isMobile: false,
  toggleSidebar: mockToggleSidebar
}

vi.mock('../sidebar-context', () => ({
  useSidebar: () => sidebarContext
}))

const mockFilter = vi.fn((children: ReactNode) => {
  const list = Array.isArray(children) ? children : [children]
  return list.filter(child => (child as any)?.type?.displayName === 'SidebarMenuSubItem')
})

vi.mock('@/utils', () => ({
  filterChildrenByDisplayNames: (children: ReactNode) => mockFilter(children)
}))

vi.mock('@/context', () => {
  const NavLink = forwardRef<HTMLAnchorElement, any>(({ className, children, ...props }, ref) => (
    <a
      data-testid="nav-link"
      ref={ref}
      className={typeof className === 'function' ? className({ isActive: props['data-active'] }) : className}
      {...props}
    >
      {typeof children === 'function' ? children({ isActive: !!props['data-active'] }) : children}
    </a>
  ))
  NavLink.displayName = 'MockNavLink'

  return {
    useRouterContext: () => ({
      NavLink
    })
  }
})

vi.mock('@/components', () => {
  const DropdownMenuRoot = ({ children }: any) => <div data-testid="dropdown-root">{children}</div>
  const DropdownMenuTrigger = forwardRef<HTMLButtonElement, any>((props, ref) => (
    <button data-testid="dropdown-trigger" ref={ref} {...props} />
  ))
  DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'
  const DropdownMenuContent = ({ children }: any) => <div data-testid="dropdown-content">{children}</div>
  const DropdownMenuItem = ({ children, onSelect, ...rest }: any) => (
    <button type="button" data-testid="dropdown-item" onClick={onSelect} {...rest}>
      {children}
    </button>
  )

  const Tooltip = ({ children, content }: any) => (
    <div data-testid="tooltip" data-content={content}>
      {typeof children === 'function' ? children() : children}
    </div>
  )
  Tooltip.displayName = 'TooltipMock'

  return {
    Avatar: ({ name, className }: any) => <div data-testid="avatar" data-name={name} className={className} />,
    Button: ({ children, onClick, className, ...props }: any) => (
      <button data-testid="button" onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    DropdownMenu: {
      Root: DropdownMenuRoot,
      Trigger: DropdownMenuTrigger,
      Content: DropdownMenuContent,
      Item: DropdownMenuItem
    },
    IconV2: ({ name }: any) => <span data-testid="icon" data-name={name} />,
    Layout: {
      Grid: ({ children, className, ...props }: any) => (
        <div data-testid="layout-grid" className={className} {...props}>
          {children}
        </div>
      ),
      Horizontal: ({ children, className }: any) => (
        <div data-testid="layout-horizontal" className={className}>
          {children}
        </div>
      ),
      Flex: ({ children }: any) => <div data-testid="layout-flex">{children}</div>
    },
    LogoV2: ({ name, className }: any) => <span data-testid="logo" data-name={name} className={className} />,
    Separator: ({ orientation, style }: any) => (
      <div data-testid="separator" data-orientation={orientation} style={style} />
    ),
    StatusBadge: ({ variant, children, className, ...props }: any) => (
      <span data-testid="status-badge" data-variant={variant} className={className} {...props}>
        {children}
      </span>
    ),
    Text: ({ children, className, variant, color }: any) => (
      <span data-testid="text" className={className} data-variant={variant} data-color={color}>
        {children}
      </span>
    ),
    Tooltip
  }
})

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

const baseProps: SidebarItemProps = {
  title: 'Item title',
  icon: 'key',
  onClick: vi.fn()
}

const renderComponent = (props: Partial<SidebarItemProps> = {}) => {
  const merged = { ...baseProps, ...props } as any
  return render(<SidebarItem {...merged} />)
}

describe('SidebarItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sidebarContext = {
      state: 'expanded',
      setOpen: vi.fn(),
      openMobile: false,
      setOpenMobile: vi.fn(),
      isMobile: false,
      toggleSidebar: mockToggleSidebar
    }
  })

  describe('Basic Rendering', () => {
    test('renders button variant by default', () => {
      renderComponent()
      expect(screen.getByRole('menuitem')).toBeInTheDocument()
      expect(screen.getByTestId('layout-grid')).toBeInTheDocument()
    })

    test('uses icon display when provided', () => {
      renderComponent({ description: 'With description' })
      const icons = screen.getAllByTestId('icon')
      expect(icons[0]).toHaveAttribute('data-name', 'key')
    })

    test('renders description when provided', () => {
      renderComponent({ description: 'Details here' })
      expect(screen.getAllByTestId('text').some(node => node.textContent === 'Details here')).toBe(true)
    })

    test('merges custom className', () => {
      renderComponent({ className: 'custom-class' })
      const button = screen.getByRole('menuitem')
      expect(button).toHaveClass('cn-sidebar-item')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Link Variant', () => {
    test('renders NavLink when to prop provided', () => {
      renderComponent({ to: '/path' })
      expect(screen.getByTestId('nav-link')).toBeInTheDocument()
    })

    test('renders disabled link wrapper when disabled', () => {
      renderComponent({ to: '/link', disabled: true })
      expect(screen.queryByTestId('nav-link')).not.toBeInTheDocument()
      const wrapper = screen.getByRole('menuitem')
      expect(wrapper).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Logo & Avatar Variants', () => {
    test('renders logo when logo prop provided', () => {
      renderComponent({ icon: undefined, logo: 'aws' })
      expect(screen.getByTestId('logo')).toHaveAttribute('data-name', 'aws')
    })

    test('renders avatar when avatar props provided', () => {
      renderComponent({ icon: undefined, avatarFallback: 'JD', src: 'avatar.png' })
      expect(screen.getByTestId('avatar')).toHaveAttribute('data-name', 'JD')
    })
  })

  describe('Badge Rendering', () => {
    test('renders string badge as outline', () => {
      renderComponent({ badge: '5' })
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-variant', 'outline')
      expect(screen.getByTestId('status-badge').textContent).toBe('5')
    })

    test('renders status badge variant', () => {
      renderComponent({
        badge: {
          content: '2',
          variant: 'status',
          theme: 'success'
        }
      })
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-variant', 'status')
    })

    test('renders custom badge variant', () => {
      renderComponent({
        badge: {
          content: '9',
          variant: 'primary',
          className: 'badge-class'
        }
      })
      const badge = screen.getByTestId('status-badge')
      expect(badge).toHaveAttribute('data-variant', 'primary')
      expect(badge).toHaveClass('badge-class')
    })
  })

  describe('Action Buttons', () => {
    test('renders action buttons when provided', async () => {
      const onAction = vi.fn()
      renderComponent({
        actionButtons: [
          {
            iconName: 'edit',
            onClick: onAction
          }
        ]
      })

      const actionButton = screen.getByTestId('layout-horizontal').querySelector('[data-testid="button"]')
      expect(actionButton).toBeInTheDocument()
      await userEvent.click(actionButton!)
      expect(onAction).toHaveBeenCalled()
    })

    test('prevents propagation when action buttons clicked', () => {
      const stopPropagation = vi.fn()
      const preventDefault = vi.fn()
      const actionClick = vi.fn()

      renderComponent({
        actionButtons: [
          {
            onClick: actionClick,
            iconName: 'key'
          }
        ]
      })

      const button = screen.getByTestId('layout-horizontal').querySelector('[data-testid="button"]')!
      const clickEvent = new MouseEvent('click', { bubbles: true }) as any
      clickEvent.stopPropagation = stopPropagation
      clickEvent.preventDefault = preventDefault

      button.dispatchEvent(clickEvent)
      expect(stopPropagation).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
      expect(actionClick).toHaveBeenCalled()
    })
  })

  describe('Dropdowns & Action Menu', () => {
    test('renders dropdown trigger when dropdown menu content provided', () => {
      renderComponent({ dropdownMenuContent: <div data-testid="custom-dropdown">content</div> })
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument()
    })

    test('renders action menu when state expanded and actionMenuItems provided', () => {
      renderComponent({
        actionMenuItems: [{ children: 'Item 1' }, { children: 'Item 2' }]
      })
      expect(screen.getAllByTestId('dropdown-item')).toHaveLength(2)
    })

    test('does not render action menu when collapsed', () => {
      sidebarContext.state = 'collapsed'
      renderComponent({ actionMenuItems: [{ children: 'Item' }] })
      expect(screen.queryByTestId('dropdown-item')).toBeNull()
    })

    test('renders right indicator when specified', () => {
      renderComponent({ withRightIndicator: true })
      const icons = screen.getAllByTestId('icon')
      expect(icons.some(icon => icon.getAttribute('data-name') === 'nav-arrow-right')).toBe(true)
    })
  })

  describe('Tooltip Logic', () => {
    test('uses provided tooltip when present', () => {
      renderComponent({ tooltip: 'Custom tooltip' })
      expect(screen.getByTestId('tooltip')).toHaveAttribute('data-content', 'Custom tooltip')
    })

    test('uses title tooltip when collapsed state and no tooltip', () => {
      sidebarContext.state = 'collapsed'
      renderComponent({ tooltip: undefined })
      expect(screen.getByTestId('tooltip')).toHaveAttribute('data-content', 'Item title')
    })

    test('renders without tooltip when expanded and no tooltip prop', () => {
      renderComponent({ tooltip: undefined })
      expect(screen.queryByTestId('tooltip')).toBeNull()
    })
  })

  describe('Submenu Behaviour', () => {
    const submenuChild = <SidebarMenuSubItem to="/child" title="Child" key="child" />

    test('filters submenu children when open', () => {
      const { rerender } = renderComponent({
        children: submenuChild,
        defaultSubmenuOpen: true
      })

      expect(mockFilter).toHaveBeenCalled()
      const grids = screen.getAllByTestId('layout-grid')
      const submenuGrid = grids[grids.length - 1]
      expect(submenuGrid).toHaveAttribute('data-state', 'open')

      sidebarContext.state = 'collapsed'
      rerender(<SidebarItem {...({ ...baseProps, defaultSubmenuOpen: true, children: submenuChild } as any)} />)

      const updatedGrids = screen.getAllByTestId('layout-grid')
      const updatedSubmenu = updatedGrids[updatedGrids.length - 1]
      expect(updatedSubmenu).toHaveAttribute('data-state', 'closed')
    })

    test('toggles submenu state on button click', async () => {
      renderComponent({ children: submenuChild, defaultSubmenuOpen: false })
      const toggleButton = screen
        .getAllByRole('button')
        .find(button => button.className.includes('cn-sidebar-item-action-button'))!
      await userEvent.click(toggleButton)
      const grids = screen.getAllByTestId('layout-grid')
      const submenuGrid = grids[grids.length - 1]
      expect(submenuGrid).toHaveAttribute('data-state', 'open')
    })
  })

  describe('Draggable Functionality', () => {
    test('renders grip icon when draggable prop is true', () => {
      const { container } = renderComponent({ draggable: true })
      const gripHandle = container.querySelector('.cn-sidebar-item-grip-handle')
      expect(gripHandle).toBeInTheDocument()
      const gripIcon = gripHandle?.querySelector('[data-testid="icon"]')
      expect(gripIcon).toHaveAttribute('data-name', 'grip-dots')
    })

    test('does not render grip icon when draggable is false', () => {
      const { container } = renderComponent({ draggable: false })
      const gripHandle = container.querySelector('.cn-sidebar-item-grip-handle')
      expect(gripHandle).toBeNull()
    })

    test('applies draggable data attribute when draggable is true', () => {
      const { container } = renderComponent({ draggable: true })
      const wrapper = container.querySelector('.cn-sidebar-item-wrapper')
      expect(wrapper).toHaveAttribute('data-draggable', 'true')
    })

    test('grip icon has active background when item is active and draggable', () => {
      const { container } = renderComponent({ draggable: true, active: true })
      const gripHandle = container.querySelector('.cn-sidebar-item-grip-handle')
      expect(gripHandle).toBeInTheDocument()
      // Verify it has the active background class applied via CSS
      const wrapper = container.querySelector('.cn-sidebar-item-wrapper')
      expect(wrapper).toHaveAttribute('data-active', 'true')
      expect(wrapper).toHaveAttribute('data-draggable', 'true')
    })

    test('content has adjusted padding when draggable', () => {
      const { container } = renderComponent({ draggable: true })
      const content = container.querySelector('.cn-sidebar-item-content')
      expect(content).toBeInTheDocument()
      // Padding adjustment is applied via CSS, verify wrapper has draggable attribute
      const wrapper = container.querySelector('.cn-sidebar-item-wrapper')
      expect(wrapper).toHaveAttribute('data-draggable', 'true')
    })
  })

  describe('SidebarMenuSubItem', () => {
    test('renders NavLink with title', () => {
      render(<SidebarMenuSubItem to="/link" title="Sub item" />)

      expect(screen.getByTestId('layout-flex')).toBeInTheDocument()
      const nav = screen.getByTestId('nav-link')
      expect(nav.textContent).toBe('Sub item')
    })

    test('renders active indicator when active', () => {
      const { container } = render(<SidebarMenuSubItem to="/link" title="Active" active />)
      const indicator = container.querySelector('.cn-sidebar-submenu-item-active-indicator')
      expect(indicator).not.toBeNull()
    })
  })
})
