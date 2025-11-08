import React, { useEffect } from 'react'

import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { HarnessLogo } from '../app-sidebar/harness-logo'
import { AppSidebarItem } from '../app-sidebar/sidebar-item'
import { CommandPalette } from '../app-sidebar/sidebar-search/command-palette'
import { SearchProvider, useSearch } from '../app-sidebar/sidebar-search/search-context'
import * as SearchContextModule from '../app-sidebar/sidebar-search/search-context'
import { SidebarSearch } from '../app-sidebar/sidebar-search/sidebar-search'
import { AppSidebarUser } from '../app-sidebar/sidebar-user'
import { MenuGroupTypes, UserMenuKeys, type NavbarItemType } from '../app-sidebar/types'

// Mock router and translation hooks
vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key
  }),
  useRouterContext: () => ({
    Link: ({ to, children, className, ...rest }: { to: string; children: React.ReactNode; className?: string }) => (
      <a data-testid="router-link" data-to={to} className={className} {...rest}>
        {children}
      </a>
    )
  })
}))

vi.mock('../illustration', () => ({
  Illustration: ({ name, ...props }: { name: string }) => <div data-testid="illustration" data-name={name} {...props} />
}))

// Mock frequently used UI primitives
vi.mock('@/components', () => {
  const SidebarItem = ({
    title,
    to,
    actionMenuItems,
    actionButtons,
    disabled,
    active,
    description,
    avatarFallback,
    src,
    dropdownMenuContent,
    className
  }: any) => (
    <div
      data-testid="sidebar-item"
      data-title={title}
      data-to={to}
      data-disabled={disabled ? 'true' : 'false'}
      data-active={active ? 'true' : 'false'}
      data-description={description ?? ''}
      data-avatar={avatarFallback ?? ''}
      data-src={src ?? ''}
      className={className}
    >
      <div data-testid="sidebar-actions">
        {(actionMenuItems ?? []).map((item: any) => (
          <button key={item.title} onClick={item.onSelect}>
            {item.title}
          </button>
        ))}
      </div>
      <div data-testid="sidebar-action-buttons">
        {(actionButtons ?? []).map((button: any, index: number) => (
          <button key={index} onClick={button.onClick}>
            {button.label ?? button.iconName ?? `action-${index}`}
          </button>
        ))}
      </div>
      <div data-testid="sidebar-dropdown">{dropdownMenuContent}</div>
    </div>
  )

  const Sidebar = {
    Item: SidebarItem
  }

  const IconV2 = ({ name, className }: { name: string; className?: string }) => (
    <span data-testid="icon" data-name={name} className={className} />
  )

  const Text = ({ children, variant, color }: any) => (
    <span data-testid="text" data-variant={variant ?? ''} data-color={color ?? ''}>
      {children}
    </span>
  )

  const SearchInput = ({ placeholder, suffix, inputContainerClassName: _ignored, ...rest }: any) => (
    <div>
      <input data-testid="search-input" placeholder={placeholder} {...rest} />
      <span data-testid="search-suffix">{suffix}</span>
    </div>
  )

  return {
    Sidebar,
    SidebarItemProps: {},
    SearchInput,
    IconV2,
    Text
  }
})

vi.mock('@components/shortcut', () => ({
  Shortcut: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="shortcut" className={className}>
      {children}
    </span>
  )
}))

vi.mock('@components/dialog', () => ({
  Dialog: {
    Root: ({
      open,
      onOpenChange,
      children
    }: {
      open: boolean
      onOpenChange: (value: boolean) => void
      children: React.ReactNode
    }) => (
      <div data-testid="dialog-root" data-open={open}>
        <button type="button" data-testid="dialog-toggle" onClick={() => onOpenChange(!open)}>
          toggle
        </button>
        {children}
      </div>
    ),
    Content: ({ children, hideClose }: { children: React.ReactNode; hideClose?: boolean }) => (
      <div data-testid="dialog-content" data-hide-close={hideClose ? 'true' : 'false'}>
        {children}
      </div>
    ),
    Body: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-body">{children}</div>
  }
}))

vi.mock('@components/dropdown-menu', () => ({
  DropdownMenu: {
    Header: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="dropdown-header" className={className}>
        {children}
      </div>
    ),
    Group: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-group">{children}</div>,
    IconItem: ({ icon, title, onClick, children }: any) => (
      <button data-testid={`dropdown-item-${title}`} data-icon={icon} onClick={onClick}>
        {children ?? title}
      </button>
    ),
    Separator: () => <div data-testid="dropdown-separator" />
  }
}))

vi.mock('@components/layout', () => ({
  Layout: {
    Grid: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="layout-grid" className={className}>
        {children}
      </div>
    )
  }
}))

vi.mock('@components/avatar', () => ({
  Avatar: ({ name, src, size }: { name?: string; src?: string; size?: string }) => (
    <div data-testid="avatar" data-name={name ?? ''} data-src={src ?? ''} data-size={size ?? ''} />
  )
}))

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid="icon" data-name={name} className={className} />
  )
}))

vi.mock('@components/sidebar', () => ({
  Sidebar: {
    Item: ({
      title,
      to,
      actionMenuItems,
      actionButtons,
      disabled,
      active,
      description,
      avatarFallback,
      src,
      dropdownMenuContent,
      className
    }: any) => (
      <div
        data-testid="sidebar-item"
        data-title={title}
        data-to={to}
        data-disabled={disabled ? 'true' : 'false'}
        data-active={active ? 'true' : 'false'}
        data-description={description ?? ''}
        data-avatar={avatarFallback ?? ''}
        data-src={src ?? ''}
        className={className}
      >
        <div data-testid="sidebar-actions">
          {(actionMenuItems ?? []).map((item: any) => (
            <button key={item.title} onClick={item.onSelect}>
              {item.title}
            </button>
          ))}
        </div>
        <div data-testid="sidebar-action-buttons">
          {(actionButtons ?? []).map((button: any, index: number) => (
            <button key={index} onClick={button.onClick}>
              {button.label ?? button.iconName ?? `action-${index}`}
            </button>
          ))}
        </div>
        <div data-testid="sidebar-dropdown">{dropdownMenuContent}</div>
      </div>
    )
  }
}))

beforeAll(() => {
  Object.defineProperty(window, 'alert', {
    writable: true,
    value: vi.fn()
  })

  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '', assign: vi.fn() }
  })
})

beforeEach(() => {
  vi.clearAllMocks()
  ;(window.alert as unknown as { mockClear: () => void }).mockClear?.()
  ;(window.location as unknown as { href: string }).href = ''
  paletteControls = null
})

afterEach(() => {
  vi.restoreAllMocks()
})

const TestConsumer = ({ onReady }: { onReady?: (context: ReturnType<typeof useSearch>) => void }) => {
  const context = useSearch()

  useEffect(() => {
    onReady?.(context)
  }, [context, onReady])

  return (
    <div>
      <span data-testid="is-open">{String(context.isOpen)}</span>
      <span data-testid="search-term">{context.searchTerm}</span>
      <span data-testid="selected-index">{String(context.selectedIndex)}</span>
    </div>
  )
}

describe('SearchProvider and useSearch', () => {
  test('throws when useSearch is used outside provider', () => {
    const ConsoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const Consumer = () => {
      useSearch()
      return null
    }

    expect(() => render(<Consumer />)).toThrowError('useSearch must be used within a SearchProvider')

    ConsoleSpy.mockRestore()
  })

  test('provides default state and setters', async () => {
    render(
      <SearchProvider>
        <TestConsumer />
      </SearchProvider>
    )

    expect(screen.getByTestId('is-open').textContent).toBe('false')
    expect(screen.getByTestId('search-term').textContent).toBe('')
    expect(screen.getByTestId('selected-index').textContent).toBe('0')

    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(screen.getByTestId('is-open').textContent).toBe('true')

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(screen.getByTestId('is-open').textContent).toBe('false')
  })

  test('setters update context values', async () => {
    const updates: Array<['isOpen' | 'searchTerm' | 'selectedIndex', unknown]> = []

    const Consumer = () => {
      const context = useSearch()

      useEffect(() => {
        context.setIsOpen(true)
        context.setSearchTerm('pipelines')
        context.setSelectedIndex(3)
      }, [context])

      useEffect(() => {
        updates.push(['isOpen', context.isOpen])
        updates.push(['searchTerm', context.searchTerm])
        updates.push(['selectedIndex', context.selectedIndex])
      }, [context.isOpen, context.searchTerm, context.selectedIndex])

      return (
        <div>
          <span data-testid="is-open">{String(context.isOpen)}</span>
          <span data-testid="search-term">{context.searchTerm}</span>
          <span data-testid="selected-index">{String(context.selectedIndex)}</span>
        </div>
      )
    }

    render(
      <SearchProvider>
        <Consumer />
      </SearchProvider>
    )

    expect(screen.getByTestId('is-open').textContent).toBe('true')
    expect(screen.getByTestId('search-term').textContent).toBe('pipelines')
    expect(screen.getByTestId('selected-index').textContent).toBe('3')
    expect(updates.some(entry => entry[0] === 'isOpen' && entry[1] === true)).toBe(true)
    expect(updates.some(entry => entry[0] === 'searchTerm' && entry[1] === 'pipelines')).toBe(true)
    expect(updates.some(entry => entry[0] === 'selectedIndex' && entry[1] === 3)).toBe(true)
  })

  test('cleans up keyboard listeners on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const removeSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = render(
      <SearchProvider>
        <div />
      </SearchProvider>
    )

    const handler = addSpy.mock.calls.find(call => call[0] === 'keydown')?.[1] as EventListener
    expect(handler).toBeInstanceOf(Function)

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', handler)
  })
})

describe('SidebarSearch', () => {
  test('warns and returns null when search context is unavailable', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const useSearchSpy = vi.spyOn(SearchContextModule, 'useSearch').mockImplementation(() => null as any)

    const { container } = render(<SidebarSearch />)

    expect(container).toBeEmptyDOMElement()
    expect(warnSpy).toHaveBeenCalledWith('⚠️ Search context is null, returning early.')

    useSearchSpy.mockRestore()
    warnSpy.mockRestore()
  })

  test('opens search when clicked and shows shortcut suffix', async () => {
    const Observer = () => {
      const { isOpen } = useSearch()
      return <span data-testid="observer-open">{String(isOpen)}</span>
    }

    render(
      <SearchProvider>
        <SidebarSearch />
        <Observer />
      </SearchProvider>
    )

    const button = screen.getByTestId('search-input').closest('button')!
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search')
    expect(screen.getByTestId('search-suffix')).toHaveTextContent('⌘K')

    await userEvent.click(button)

    expect(screen.getByTestId('observer-open')).toHaveTextContent('true')
  })
})

let paletteControls: ReturnType<typeof useSearch> | null = null

const CaptureControls = () => {
  const context = useSearch()

  useEffect(() => {
    paletteControls = context
  }, [context])

  return null
}

describe('CommandPaletteWrapper', () => {
  const openPalette = (extra?: React.ReactNode) => {
    const ToggleOpen = () => {
      const { setIsOpen } = useSearch()
      useEffect(() => {
        setIsOpen(true)
      }, [setIsOpen])
      return null
    }

    render(
      <SearchProvider>
        <ToggleOpen />
        {extra}
      </SearchProvider>
    )
  }

  beforeEach(() => {
    ;(window.alert as unknown as { mockClear: () => void }).mockClear?.()
  })

  test('renders menu options when open', async () => {
    openPalette()

    expect(await screen.findByText('Search repositories...')).toBeInTheDocument()
    expect(screen.getByText('Create repository')).toBeInTheDocument()
    expect(screen.getByText('Import repository')).toBeInTheDocument()
  })

  test('updates placeholder and navigates sub items', async () => {
    openPalette()

    const menuItem = await screen.findByText('Search repositories...')
    await userEvent.click(menuItem)

    const input = (await screen.findByPlaceholderText('Search repositories...')) as HTMLInputElement
    expect(input.placeholder).toBe('Search repositories...')

    const subItem = await screen.findByText('petstore-app')
    await userEvent.click(subItem)

    expect(window.location.href).toBe('/canary/repos/petstore-app/summary')
  })

  test('invokes alert actions for menu items without navigation', async () => {
    openPalette()

    const createButton = await screen.findByText('Create repository')
    await userEvent.click(createButton)

    expect(window.alert).toHaveBeenCalledWith('Create Repository')
  })

  test('handles keyboard navigation and closing behavior', async () => {
    openPalette(<CaptureControls />)

    const searchRepositories = await screen.findByText('Search repositories...')
    await userEvent.click(searchRepositories)

    const input = (await screen.findByPlaceholderText('Search repositories...')) as HTMLInputElement
    await userEvent.type(input, 'query')

    const root = document.querySelector('[cmdk-root]') as HTMLElement
    expect(root).toBeTruthy()

    fireEvent.keyDown(input, { key: 'Backspace' })
    expect(await screen.findByPlaceholderText('Search repositories...')).toBeInTheDocument()

    await userEvent.clear(input)
    await act(async () => {
      paletteControls?.setSearchTerm('')
    })
    fireEvent.keyDown(input, { key: 'Backspace' })
    expect(await screen.findByText('Search projects...')).toBeInTheDocument()

    const reenter = await screen.findByText('Search repositories...')
    await userEvent.click(reenter)
    const reenteredInput = (await screen.findByPlaceholderText('Search repositories...')) as HTMLInputElement
    fireEvent.keyDown(reenteredInput, { key: 'Escape' })
    expect(await screen.findByText('Search projects...')).toBeInTheDocument()
  })

  test('respects dialog open change events', async () => {
    openPalette()

    const dialog = await screen.findByTestId('dialog-root')
    expect(dialog).toHaveAttribute('data-open', 'true')

    const toggle = screen.getByTestId('dialog-toggle')
    await userEvent.click(toggle)

    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  test('renders all menu option icons correctly', async () => {
    openPalette()

    await screen.findByText('Search repositories...')

    const icons = screen.getAllByTestId('icon')
    expect(icons.length).toBeGreaterThan(0)
  })

  test('handles Projects menu navigation', async () => {
    openPalette()

    const projectsItem = await screen.findByText('Search projects...')
    await userEvent.click(projectsItem)

    const input = (await screen.findByPlaceholderText('Search projects...')) as HTMLInputElement
    expect(input.placeholder).toBe('Search projects...')

    const canaryProject = await screen.findByText('Canary')
    await userEvent.click(canaryProject)

    expect(window.location.href).toBe('/canary/repos/petstore-app/summary')
  })

  test('handles Pipelines menu navigation', async () => {
    openPalette()

    const pipelinesItem = await screen.findByText('Search pipelines...')
    await userEvent.click(pipelinesItem)

    const input = (await screen.findByPlaceholderText('Search pipelines...')) as HTMLInputElement
    expect(input.placeholder).toBe('Search pipelines...')

    const buildPipeline = await screen.findByText('build-pipeline')
    await userEvent.click(buildPipeline)

    expect(window.location.href).toBe('/canary/pipelines/build-pipeline/studio')
  })

  test('invokes Create Project action', async () => {
    openPalette()

    const createProjectButton = await screen.findByText('Create project')
    await userEvent.click(createProjectButton)

    expect(window.alert).toHaveBeenCalledWith('Create Project')
  })

  test('invokes Import Project action', async () => {
    openPalette()

    const importProjectButton = await screen.findByText('Import project')
    await userEvent.click(importProjectButton)

    expect(window.alert).toHaveBeenCalledWith('Import Project')
  })

  test('invokes Import Repository action', async () => {
    openPalette()

    const importRepoButton = await screen.findByText('Import repository')
    await userEvent.click(importRepoButton)

    expect(window.alert).toHaveBeenCalledWith('Import Repository')
  })

  test('invokes Create Pipeline action', async () => {
    openPalette()

    const createPipelineButton = await screen.findByText('Create pipeline')
    await userEvent.click(createPipelineButton)

    expect(window.alert).toHaveBeenCalledWith('Create Pipeline')
  })

  test('renders all repository sub-items', async () => {
    openPalette()

    const searchRepositories = await screen.findByText('Search repositories...')
    await userEvent.click(searchRepositories)

    expect(await screen.findByText('petstore-app')).toBeInTheDocument()
    expect(screen.getByText('RealWorld')).toBeInTheDocument()
    expect(screen.getByText('sock shop')).toBeInTheDocument()
    expect(screen.getByText('anthos')).toBeInTheDocument()
    expect(screen.getByText('acme-web')).toBeInTheDocument()
  })

  test('renders all project sub-items', async () => {
    openPalette()

    const searchProjects = await screen.findByText('Search projects...')
    await userEvent.click(searchProjects)

    expect(await screen.findByText('Canary')).toBeInTheDocument()
    expect(screen.getByText('Paypal')).toBeInTheDocument()
  })
})

describe('CommandPalette components', () => {
  test('renders dialog with body and content', () => {
    render(
      <CommandPalette.Dialog open onOpenChange={() => {}}>
        <CommandPalette.Root>
          <CommandPalette.List>
            <CommandPalette.Empty>Nothing</CommandPalette.Empty>
          </CommandPalette.List>
        </CommandPalette.Root>
      </CommandPalette.Dialog>
    )

    expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-body')).toBeInTheDocument()
  })

  test('renders dropdown and child components', async () => {
    render(
      <CommandPalette.Dropdown open onOpenChange={() => {}}>
        <CommandPalette.Input placeholder="Type here" />
        <CommandPalette.Separator />
        <CommandPalette.Group heading="Group heading">
          <CommandPalette.Item>
            <CommandPalette.Shortcut>
              <span>⌘</span>
            </CommandPalette.Shortcut>
            Option
          </CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette.Dropdown>
    )

    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
    expect(document.querySelector('[cmdk-group]')).toBeTruthy()
    expect(document.querySelector('[cmdk-item]')).toBeTruthy()
    expect(document.querySelector('[cmdk-separator]')).toBeTruthy()
    expect(screen.getByText('⌘')).toBeInTheDocument()
  })
})

describe('AppSidebarItem', () => {
  const baseItem: NavbarItemType = {
    id: '1',
    title: 'Repositories',
    to: '/repos'
  }

  test('renders menu actions for recent items', async () => {
    const handlePin = vi.fn()
    const handleRemoveRecent = vi.fn()

    render(
      <AppSidebarItem
        item={baseItem}
        isRecent
        handleChangePinnedMenuItem={handlePin}
        handleRemoveRecentMenuItem={handleRemoveRecent}
        handleCustomNav={() => {}}
      />
    )

    await userEvent.click(screen.getByText('Pin'))
    expect(handlePin).toHaveBeenCalledWith(baseItem, true)

    await userEvent.click(screen.getByText('Remove'))
    expect(handleRemoveRecent).toHaveBeenCalledWith(baseItem)
  })

  test('omits unpin option for permanently pinned items', () => {
    const handlePin = vi.fn()

    render(
      <AppSidebarItem
        item={{ ...baseItem, permanentlyPinned: true }}
        handleChangePinnedMenuItem={handlePin}
        handleRemoveRecentMenuItem={() => {}}
        handleCustomNav={() => {}}
      />
    )

    expect(screen.getByText('Reorder')).toBeInTheDocument()
    expect(screen.queryByText('Unpin')).not.toBeInTheDocument()
  })

  test('renders unpin action when item is not permanently pinned', async () => {
    const handlePin = vi.fn()
    const handleCustomNav = vi.fn()

    render(
      <AppSidebarItem
        item={baseItem}
        handleChangePinnedMenuItem={handlePin}
        handleRemoveRecentMenuItem={() => {}}
        handleCustomNav={handleCustomNav}
        actionButtons={[{ onClick: handleCustomNav, children: 'Action' }]}
        disabled
        active
      />
    )

    await userEvent.click(screen.getByText('Reorder'))
    expect(handleCustomNav).toHaveBeenCalled()

    await userEvent.click(screen.getByText('Unpin'))
    expect(handlePin).toHaveBeenCalledWith(baseItem, false)

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-disabled', 'true')
    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-active', 'true')
  })

  test('respects hideMenuItems flag', () => {
    render(
      <AppSidebarItem
        item={baseItem}
        hideMenuItems
        handleChangePinnedMenuItem={() => {}}
        handleRemoveRecentMenuItem={() => {}}
        handleCustomNav={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-actions').textContent).toBe('')
  })

  test('renders item with empty to property', () => {
    render(
      <AppSidebarItem
        item={{ ...baseItem, to: undefined as any }}
        handleChangePinnedMenuItem={() => {}}
        handleRemoveRecentMenuItem={() => {}}
        handleCustomNav={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-to', '')
  })
})

describe('AppSidebarUser', () => {
  test('renders user information and triggers dropdown actions', async () => {
    const openThemeDialog = vi.fn()
    const openLanguageDialog = vi.fn()
    const handleLogOut = vi.fn()

    render(
      <AppSidebarUser
        user={{
          display_name: 'Jane Doe',
          email: 'jane@example.com',
          url: '/avatar.png',
          uid: 'jane'
        }}
        openThemeDialog={openThemeDialog}
        openLanguageDialog={openLanguageDialog}
        handleLogOut={handleLogOut}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-title', 'Jane Doe')
    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-description', 'jane@example.com')
    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-avatar', 'Jane Doe')
    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-src', '/avatar.png')

    await userEvent.click(screen.getByTestId('dropdown-item-Appearance'))
    await userEvent.click(screen.getByTestId('dropdown-item-Language'))
    await userEvent.click(screen.getByTestId('dropdown-item-Logout'))

    expect(openThemeDialog).toHaveBeenCalled()
    expect(openLanguageDialog).toHaveBeenCalled()
    expect(handleLogOut).toHaveBeenCalled()
  })

  test('uses uid as fallback when display name missing', () => {
    render(
      <AppSidebarUser
        user={{
          uid: 'fallback-user'
        }}
        openThemeDialog={() => {}}
        openLanguageDialog={() => {}}
        handleLogOut={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-title', 'fallback-user')
  })

  test('renders without email when not provided', () => {
    render(
      <AppSidebarUser
        user={{
          display_name: 'John Doe',
          uid: 'john'
        }}
        openThemeDialog={() => {}}
        openLanguageDialog={() => {}}
        handleLogOut={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-title', 'John Doe')
    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-description', '')
  })

  test('renders settings link correctly', () => {
    render(
      <AppSidebarUser
        user={{
          display_name: 'Test User',
          uid: 'test'
        }}
        openThemeDialog={() => {}}
        openLanguageDialog={() => {}}
        handleLogOut={() => {}}
      />
    )

    const settingsLink = screen.getByTestId('router-link')
    expect(settingsLink).toHaveAttribute('data-to', '/profile-settings')
  })

  test('renders with empty string when user is undefined', () => {
    render(
      <AppSidebarUser
        user={undefined}
        openThemeDialog={() => {}}
        openLanguageDialog={() => {}}
        handleLogOut={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-title', '')
  })

  test('renders with empty string when both display_name and uid are missing', () => {
    render(
      <AppSidebarUser
        user={{} as any}
        openThemeDialog={() => {}}
        openLanguageDialog={() => {}}
        handleLogOut={() => {}}
      />
    )

    expect(screen.getByTestId('sidebar-item')).toHaveAttribute('data-title', '')
  })
})

describe('HarnessLogo', () => {
  test('renders link with icon and illustration', () => {
    render(<HarnessLogo className="custom" />)

    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('data-to', '/')
    expect(link).toHaveClass('custom')
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'harness-plugins')
  })
})

describe('App Sidebar types', () => {
  test('ensures enum values are exposed', () => {
    expect(MenuGroupTypes.GENERAL).toBe('general')
    expect(MenuGroupTypes.SETTINGS).toBe('settings')
    expect(UserMenuKeys.ACCOUNT).toBe('account')
    expect(UserMenuKeys.THEME).toBe('theme')
    expect(UserMenuKeys.CUSTOM_NAV).toBe('customNavigation')
    expect(UserMenuKeys.ADMINISTRATION).toBe('administration')
    expect(UserMenuKeys.LOG_OUT).toBe('logOut')
  })
})
