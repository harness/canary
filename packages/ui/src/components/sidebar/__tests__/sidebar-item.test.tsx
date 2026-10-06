import { Children, forwardRef, isValidElement, ReactNode } from 'react'

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

// Mirrors the real `filterChildrenByDisplayNames` (flattens nested arrays, skips falsy/text/DOM children)
const mockFilter = vi.fn((children: ReactNode) =>
  Children.toArray(children).filter(
    child =>
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      (child.type as any).displayName === 'SidebarMenuSubItem'
  )
)

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
      NavLink,
      location: { pathname: '/' }
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

    test('does not render action buttons when collapsed', () => {
      sidebarContext.state = 'collapsed'
      renderComponent({
        actionButtons: [
          {
            iconName: 'pin',
            onClick: vi.fn()
          }
        ]
      })

      expect(screen.queryByTestId('layout-horizontal')).toBeNull()
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
    test('uses title tooltip when collapsed state', () => {
      sidebarContext.state = 'collapsed'
      renderComponent()
      expect(screen.getByTestId('tooltip')).toHaveAttribute('data-content', 'Item title')
    })

    test('renders without tooltip when expanded', () => {
      renderComponent()
      expect(screen.queryByTestId('tooltip')).toBeNull()
    })
  })

  describe('Submenu Behaviour', () => {
    const submenuChild = <SidebarMenuSubItem to="/child" title="Child" key="child" active />

    test('filters submenu children when open', () => {
      const { rerender } = renderComponent({
        children: submenuChild,
        defaultSubmenuOpen: true
      })

      expect(mockFilter).toHaveBeenCalled()
      expect(screen.getByRole('group')).toHaveAttribute('data-state', 'open')
      expect(screen.getByText('Child')).toBeInTheDocument()

      sidebarContext.state = 'collapsed'
      rerender(<SidebarItem {...({ ...baseProps, defaultSubmenuOpen: true, children: submenuChild } as any)} />)

      expect(screen.getByRole('group', { hidden: true })).toHaveAttribute('data-state', 'closed')
      expect(screen.getByText('Child')).toBeInTheDocument()
    })

    test('keeps submenu items mounted when closed', () => {
      renderComponent({ children: submenuChild, defaultSubmenuOpen: false })
      expect(screen.getByRole('group', { hidden: true })).toHaveAttribute('data-state', 'closed')
      expect(screen.getByRole('group', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByText('Child')).toBeInTheDocument()
    })

    test('toggles submenu state on button click', async () => {
      renderComponent({ children: submenuChild, defaultSubmenuOpen: false })
      const menuItemButton = screen.getByRole('menuitem')
      await userEvent.click(menuItemButton)
      expect(screen.getByRole('group')).toHaveAttribute('data-state', 'open')
    })

    test('expands sidebar and opens submenu when clicked while collapsed', async () => {
      sidebarContext.state = 'collapsed'
      const { rerender } = renderComponent({ children: submenuChild, defaultSubmenuOpen: false })

      await userEvent.click(screen.getByRole('menuitem'))

      expect(sidebarContext.setOpen).toHaveBeenCalledWith(true)

      // Simulate sidebar finishing expand (setOpen from context is mocked)
      sidebarContext.state = 'expanded'
      rerender(<SidebarItem {...({ ...baseProps, children: submenuChild, defaultSubmenuOpen: false } as any)} />)

      expect(screen.getByRole('group')).toHaveAttribute('data-state', 'open')
    })

    test('marks parent active when collapsed and a sub-item has active', () => {
      sidebarContext.state = 'collapsed'
      const { container } = renderComponent({ children: submenuChild, defaultSubmenuOpen: true })
      const wrapper = container.querySelector('.cn-sidebar-item-wrapper')
      expect(wrapper).toHaveAttribute('data-active', 'true')
    })

    test('does not mark parent active from sub-item active when expanded', () => {
      sidebarContext.state = 'expanded'
      const { container } = renderComponent({ children: submenuChild, defaultSubmenuOpen: true })
      const wrapper = container.querySelector('.cn-sidebar-item-wrapper')
      expect(wrapper).toHaveAttribute('data-active', 'false')
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

    describe('nested group (third level)', () => {
      const renderNested = (groupProps: Record<string, unknown> = {}, leafProps: Record<string, unknown> = {}) =>
        renderComponent({
          defaultSubmenuOpen: true,
          children: (
            <SidebarMenuSubItem title="Group" {...groupProps}>
              <SidebarMenuSubItem title="Leaf one" to="/one" {...leafProps} />
              <SidebarMenuSubItem title="Leaf two" to="/two" />
            </SidebarMenuSubItem>
          )
        })

      const getGroupTrigger = () => screen.getByRole('menuitem', { name: /Group/ })
      const getNestedGroup = () => screen.getAllByRole('group', { hidden: true })[1]

      test('renders a collapsible trigger instead of a link', () => {
        renderNested()
        const trigger = getGroupTrigger()
        expect(trigger.tagName).toBe('BUTTON')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(screen.getAllByTestId('nav-link').map(el => el.textContent)).toEqual(['Leaf one', 'Leaf two'])
      })

      test('keeps nested items mounted but hidden while closed', () => {
        renderNested()
        expect(getNestedGroup()).toHaveAttribute('data-state', 'closed')
        expect(getNestedGroup()).toHaveAttribute('aria-hidden', 'true')
      })

      test('links the trigger to the nested group via aria-controls', () => {
        renderNested()
        const id = getGroupTrigger().getAttribute('aria-controls')
        expect(id).toBeTruthy()
        expect(getNestedGroup()).toHaveAttribute('id', id)
      })

      test('toggles open and closed on click', async () => {
        renderNested()
        await userEvent.click(getGroupTrigger())
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
        expect(getNestedGroup()).toHaveAttribute('data-state', 'open')

        await userEvent.click(getGroupTrigger())
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'false')
        expect(getNestedGroup()).toHaveAttribute('data-state', 'closed')
      })

      test('respects defaultOpen', () => {
        renderNested({ defaultOpen: true })
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
      })

      test('starts open when a nested item is active', () => {
        renderNested({}, { active: true })
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
      })

      test('opens when a nested item becomes active after mount', () => {
        const build = (active: boolean) => (
          <SidebarItem
            {...({
              ...baseProps,
              defaultSubmenuOpen: true,
              children: (
                <SidebarMenuSubItem title="Group">
                  <SidebarMenuSubItem title="Leaf one" to="/one" active={active} />
                </SidebarMenuSubItem>
              )
            } as any)}
          />
        )
        const { rerender } = render(build(false))
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'false')

        rerender(build(true))
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
      })

      test('shows the active indicator on a closed group with an active descendant', async () => {
        const { container } = renderNested({}, { active: true })
        // Leaf indicator only while open
        expect(container.querySelectorAll('.cn-sidebar-submenu-item-active-indicator')).toHaveLength(1)

        await userEvent.click(getGroupTrigger())
        // Group indicator appears once collapsed, leaf indicator stays (hidden by the collapsed group)
        expect(container.querySelectorAll('.cn-sidebar-submenu-item-active-indicator')).toHaveLength(2)
      })

      test('controlled: does not toggle itself and reports changes via onOpenChange', async () => {
        const onOpenChange = vi.fn()
        renderNested({ open: false, onOpenChange })

        await userEvent.click(getGroupTrigger())
        expect(onOpenChange).toHaveBeenCalledWith(true)
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'false')
      })

      test('controlled: follows the open prop', () => {
        const { rerender } = renderComponent({
          defaultSubmenuOpen: true,
          children: (
            <SidebarMenuSubItem title="Group" open={false}>
              <SidebarMenuSubItem title="Leaf" to="/leaf" />
            </SidebarMenuSubItem>
          )
        })
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'false')

        rerender(
          <SidebarItem
            {...({
              ...baseProps,
              defaultSubmenuOpen: true,
              children: (
                <SidebarMenuSubItem title="Group" open>
                  <SidebarMenuSubItem title="Leaf" to="/leaf" />
                </SidebarMenuSubItem>
              )
            } as any)}
          />
        )
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
      })

      test('uncontrolled: still reports changes via onOpenChange', async () => {
        const onOpenChange = vi.fn()
        renderNested({ onOpenChange })
        await userEvent.click(getGroupTrigger())
        expect(onOpenChange).toHaveBeenCalledWith(true)
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'true')
      })

      test('lets the user close a group that contains the active item', async () => {
        renderNested({}, { active: true })
        await userEvent.click(getGroupTrigger())
        expect(getGroupTrigger()).toHaveAttribute('aria-expanded', 'false')
      })

      test('nested group does not force visibility, so a closed ancestor still hides it', () => {
        renderNested({ defaultOpen: true })
        const [outer, inner] = screen.getAllByRole('group', { hidden: true })
        expect(outer).toHaveStyle({ visibility: 'inherit' })
        expect(inner).toHaveStyle({ visibility: 'inherit' })
      })

      test('renders a link, not a group, when children contain no sub-items', () => {
        renderComponent({
          defaultSubmenuOpen: true,
          children: <SidebarMenuSubItem {...({ title: 'Empty', to: '/empty', children: [] } as any)} />
        })
        expect(screen.getByTestId('nav-link')).toHaveTextContent('Empty')
        expect(screen.getByText('Empty').closest('button')).toBeNull()
      })

      test('supports mapped (nested array) and conditional children, as a recursive data model produces', async () => {
        const nodes = [
          { title: 'Pipelines', to: '/p' },
          { title: 'Executions', to: '/e' }
        ]
        renderComponent({
          defaultSubmenuOpen: true,
          children: (
            <SidebarMenuSubItem title="Group">
              {nodes.map(n => (
                <SidebarMenuSubItem key={n.to} title={n.title} to={n.to} />
              ))}
              {false}
            </SidebarMenuSubItem>
          )
        })
        expect(screen.getByRole('menuitem', { name: /Group/ })).toHaveAttribute('aria-expanded', 'false')
        expect(screen.getByText('Pipelines')).toBeInTheDocument()
        expect(screen.getByText('Executions')).toBeInTheDocument()
      })

      test('strips group-only props from the link fallback', () => {
        const onOpenChange = vi.fn()
        renderComponent({
          defaultSubmenuOpen: true,
          children: (
            <SidebarMenuSubItem
              {...({ title: 'Empty', to: '/empty', children: [], open: true, defaultOpen: true, onOpenChange } as any)}
            />
          )
        })
        const link = screen.getByTestId('nav-link')
        expect(link).not.toHaveAttribute('open')
        expect(link).not.toHaveAttribute('defaultopen')
      })

      test('renders nothing when a group has no sub-items and no link target', () => {
        renderComponent({
          defaultSubmenuOpen: true,
          children: <SidebarMenuSubItem {...({ title: 'Filtered', children: [], onOpenChange: vi.fn() } as any)} />
        })
        expect(screen.queryByText('Filtered')).toBeNull()
      })

      test('forwards ref and extra props to the group trigger button', async () => {
        const ref = { current: null as HTMLButtonElement | null }
        const onClick = vi.fn()
        renderComponent({
          defaultSubmenuOpen: true,
          children: (
            <SidebarMenuSubItem title="Group" ref={ref} data-testid="group-trigger" onClick={onClick}>
              <SidebarMenuSubItem title="Leaf" to="/leaf" />
            </SidebarMenuSubItem>
          )
        })
        expect(ref.current).toBe(screen.getByTestId('group-trigger'))

        await userEvent.click(ref.current!)
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(ref.current).toHaveAttribute('aria-expanded', 'true')
      })

      test('marks the top-level item active when collapsed and a third-level item is active', () => {
        sidebarContext.state = 'collapsed'
        const { container } = renderNested({}, { active: true })
        expect(container.querySelector('.cn-sidebar-item-wrapper')).toHaveAttribute('data-active', 'true')
      })
    })
  })
})
