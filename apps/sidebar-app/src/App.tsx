import '@harnessio/ui/styles.css'
import './App.css'

import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import {
  Drawer,
  DropdownMenu,
  IconV2,
  Input,
  Layout,
  Sidebar,
  Text,
  TooltipProvider,
  useSidebar,
  type DrawerContentProps,
  type SidebarItemProps
} from '@harnessio/ui/components'
import {
  defaultTheme,
  DialogProvider,
  RouterContextProvider,
  ThemeProvider,
  TranslationProvider,
  useRouterContext,
  useTheme,
  type FullTheme
} from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import { moreMenuModuleItems, type MoreMenuDrawerItem } from './more-menu-module-items'
import { moreMenuResourceItems } from './more-menu-resource-items'

const LIGHT_THEME = 'light-std-std' as FullTheme
const DARK_THEME = 'dark-std-std' as FullTheme

const footerUserMenuProfile = 'Profile'
const footerUserMenuDocumentation = 'Documentation'
const footerUserMenuTheme = 'Theme'
const footerUserMenuPrivacy = 'Privacy'
const footerUserMenuLogout = 'Logout'

const footerUserSidebarTitle = 'vardan.bansal@harness.io'
const footerUserAvatarName = 'Vardan Bansal'

const footerDocumentationUrl = 'https://developer.harness.io/'

const workspaceSwitcher = {
  to: '/',
  title: 'Harness',
  description: 'default',
  logo: 'harness' as const,
  withRightIndicator: true as const
}

const pinnedHomeItem: SidebarItemProps = { to: '/home', title: 'Home', icon: 'view-grid' }

const moreMenuSearchPlaceholder = 'Search'

const moreDrawerToggleMoreLabel = 'More'
const moreDrawerToggleLessLabel = 'Less'

type MoreMenuDrawerSectionConfig = {
  groupId: string
  label: string
  /** When collapsed, only this many items show before More */
  previewCount: number
  defaultExpanded: boolean
  items: MoreMenuDrawerItem[]
}

const moreMenuDrawerSections: MoreMenuDrawerSectionConfig[] = [
  {
    groupId: 'modules',
    label: 'Modules',
    previewCount: 6,
    defaultExpanded: true,
    items: moreMenuModuleItems
  },
  {
    groupId: 'resources',
    label: 'Resources',
    previewCount: 4,
    defaultExpanded: false,
    items: moreMenuResourceItems
  }
]

const moreMenuTriggerTitle = 'more'

const moreDrawerDirection = 'left' as const
const moreMenuIconName = 'menu-more-horizontal' as const
const moreDrawerBodyContentClass = 'more-drawer'
const moreDrawerNavRowClass = 'more-drawer-row'
const moreDrawerGroupItemsClass = 'more-drawer-group-items'
const moreDrawerLayoutColumn = 'column' as const
const moreDrawerLayoutGap = 'none' as const
const moreDrawerSearchInputIcon = 'search' as const
const moreDrawerInputWrapperClass = 'w-full'

const recentSectionLabel = 'Recent'

const demoItems: SidebarItemProps[] = [
  { to: '/repos', title: 'Repositories', icon: 'folder' },
  { to: '/pipelines', title: 'Pipelines', icon: 'play' },
  { to: '/connectors', title: 'Connectors', icon: 'connectors', active: true },
  {
    to: '/account',
    title: 'Account',
    icon: 'user'
  },
  { to: '/settings', title: 'Settings', icon: 'settings' }
]

const infrastructureNav = {
  parent: { title: 'Infrastructure', icon: 'infrastructure' as const },
  subItems: [
    { to: '/infra/clusters', title: 'Clusters' },
    { to: '/infra/environments', title: 'Environments' }
  ]
} as const

const submenuInsertAfterTitle = demoItems.find(i => 'to' in i && i.to === '/connectors')?.title ?? ''

const insetChatPlaceholderLabel = 'Chat'
const insetPagePlaceholderLabel = 'App content'

const AppNavFooterUser: FC = () => {
  const { Link } = useRouterContext()
  const { theme, setTheme } = useTheme()
  const isLight = theme === LIGHT_THEME

  return (
    <Sidebar.Item
      title={footerUserSidebarTitle}
      avatarFallback={footerUserAvatarName}
      dropdownMenuContent={
        <>
          <DropdownMenu.Group>
            <Link to="/profile">
              <DropdownMenu.IconItem icon="user" title={footerUserMenuProfile} />
            </Link>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.IconItem
              icon="empty-page"
              title={footerUserMenuDocumentation}
              onSelect={e => {
                e.preventDefault()
                window.open(footerDocumentationUrl, '_blank', 'noopener,noreferrer')
              }}
            />
            <DropdownMenu.IconItem
              icon="theme"
              title={footerUserMenuTheme}
              onSelect={e => {
                e.preventDefault()
                setTheme(isLight ? DARK_THEME : LIGHT_THEME)
              }}
            />
            <Link to="/privacy">
              <DropdownMenu.IconItem icon="shield" title={footerUserMenuPrivacy} />
            </Link>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.IconItem
            icon="logout"
            title={footerUserMenuLogout}
            onSelect={e => {
              e.preventDefault()
            }}
          />
        </>
      }
    />
  )
}

const MoreDrawerSectionGroup: FC<{ section: MoreMenuDrawerSectionConfig }> = ({ section }) => {
  const { groupId, label, previewCount, defaultExpanded, items } = section
  const [expanded, setExpanded] = useState(defaultExpanded)
  const needsToggle = items.length > previewCount
  const visibleItems = !needsToggle || expanded ? items : items.slice(0, previewCount)

  return (
    <Sidebar.Group label={label} className="more-drawer-group">
      <div className={moreDrawerGroupItemsClass}>
        {visibleItems.map(item => (
          <Drawer.Close key={`${groupId}-${item.to}`} asChild>
            <Sidebar.Item {...item} className={moreDrawerNavRowClass} />
          </Drawer.Close>
        ))}
      </div>
      {needsToggle ? (
        <button
          type="button"
          className="more-drawer-toggle"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
        >
          <Text variant="caption-single-line-normal" color="foreground-3">
            {expanded ? moreDrawerToggleLessLabel : moreDrawerToggleMoreLabel}
          </Text>
          <IconV2
            name={expanded ? 'nav-arrow-up' : 'nav-arrow-down'}
            size="xs"
            className="more-drawer-toggle-chevron"
          />
        </button>
      ) : null}
    </Sidebar.Group>
  )
}

/** Full-height nav column: sidebar + rail (single grid cell beside main). */
const AppNav: FC = () => {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  const moreMenuDrawerContentProps: DrawerContentProps = useMemo(
    () => ({
      className: cn(
        'cn-sidebar-drawer-content sidebar-app-more-menu-drawer z-20 overflow-x-hidden rounded',
        {
          'cn-sidebar-menu-drawer-content-collapsed': isSidebarCollapsed
        }
      ),
      overlayClassName: cn('bg-transparent z-20 opacity-0', {
        'cn-sidebar-drawer-overlay-collapsed': isSidebarCollapsed
      }),
      modal: false,
      hideClose: true,
      onPointerDownOutside: () => setMoreMenuOpen(false)
    }),
    [isSidebarCollapsed]
  )

  return (
    <div className="app-shell-nav-column relative flex h-full min-h-0 min-w-0">
      <div className="sidebar-app-shell h-full min-h-0 min-w-0 flex-1">
        <Sidebar.Root className="sidebar-app-figma">
          <Sidebar.Header className="sidebar-app-sidebar-header">
            <Sidebar.Item {...workspaceSwitcher} />
          </Sidebar.Header>

          <Sidebar.Group className="sidebar-app-sidebar-group-pinned">
            <Sidebar.Item {...pinnedHomeItem} />
            <Drawer.Root direction={moreDrawerDirection} open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
              <Sidebar.Item
                title={moreMenuTriggerTitle}
                icon={moreMenuIconName}
                withRightIndicator
                onClick={() => setMoreMenuOpen(true)}
              />
              <Drawer.Content {...moreMenuDrawerContentProps}>
                <Drawer.Title className="sr-only">{moreMenuTriggerTitle}</Drawer.Title>
                <Drawer.Description className="sr-only">{moreMenuTriggerTitle}</Drawer.Description>
                <Drawer.Body classNameContent={moreDrawerBodyContentClass}>
                  <Layout.Flex direction={moreDrawerLayoutColumn} gap={moreDrawerLayoutGap}>
                    <div className="more-drawer-search">
                      <Input
                        id="more-menu-search"
                        inputIconName={moreDrawerSearchInputIcon}
                        placeholder={moreMenuSearchPlaceholder}
                        wrapperClassName={moreDrawerInputWrapperClass}
                        aria-label={moreMenuSearchPlaceholder}
                      />
                    </div>
                    <Sidebar.Separator />
                    {moreMenuDrawerSections.map((section, sectionIndex) => (
                      <Fragment key={section.groupId}>
                        <MoreDrawerSectionGroup section={section} />
                        {sectionIndex < moreMenuDrawerSections.length - 1 ? <Sidebar.Separator /> : null}
                      </Fragment>
                    ))}
                  </Layout.Flex>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Content>
            <Sidebar.Group label={recentSectionLabel} className="sidebar-app-sidebar-group-recent">
              {demoItems.map(item => (
                <Fragment key={item.title}>
                  <Sidebar.Item {...item} />
                  {item.title === submenuInsertAfterTitle ? (
                    <Sidebar.Item {...infrastructureNav.parent} defaultSubmenuOpen>
                      {infrastructureNav.subItems.map(sub => (
                        <Sidebar.MenuSubItem key={sub.to} {...sub} />
                      ))}
                    </Sidebar.Item>
                  ) : null}
                </Fragment>
              ))}
            </Sidebar.Group>
          </Sidebar.Content>

          <Sidebar.Footer className="sidebar-app-sidebar-footer">
            <AppNavFooterUser />
          </Sidebar.Footer>
        </Sidebar.Root>
      </div>
      <Sidebar.Rail animate className="top-cn-xs rounded-tl-cn-6 rounded-bl-cn-6 bottom-cn-xs w-5" />
    </div>
  )
}

const appShellMainClass = 'app-shell-main'

const appShellRootClass = 'app-shell'
const appShellBodyClass = 'app-shell-body'

const AppContent: FC = () => (
  <Sidebar.Inset className="app-shell-content app-shell-inset min-h-0 w-full flex-1">
    <div className="app-shell-inset-inner">
      <aside className="app-shell-inset-chat app-shell-inset-card" aria-label={insetChatPlaceholderLabel}>
        <div className="app-shell-inset-placeholder">
          <Text variant="body-normal" color="foreground-3">
            {insetChatPlaceholderLabel}
          </Text>
        </div>
      </aside>
      <main className="app-shell-inset-page app-shell-inset-card" aria-label={insetPagePlaceholderLabel}>
        <div className="app-shell-inset-placeholder">
          <Text variant="body-normal" color="foreground-3">
            {insetPagePlaceholderLabel}
          </Text>
        </div>
      </main>
    </div>
  </Sidebar.Inset>
)

const AppShell: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'

  const shellBodyColumns = isSidebarCollapsed
    ? 'var(--cn-sidebar-container-min-width) 1fr'
    : 'var(--cn-sidebar-container-full-width) 1fr'

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
      useParams={useParams}
    >
      <div className={`${appShellRootClass} bg-cn-0 flex h-screen min-h-0 w-full flex-col`}>
        <Layout.Grid
          columns={shellBodyColumns}
          className={`${appShellBodyClass} min-h-0 w-full flex-1 transition-all duration-200 ease-in-out`}
        >
          <AppNav />
          <div className={`${appShellMainClass} flex h-full min-h-0 min-w-0 flex-col`}>
            <App.Content />
          </div>
        </Layout.Grid>
      </div>
    </RouterContextProvider>
  )
}

type AppNamespace = FC & {
  Shell: FC
  Nav: FC
  Content: FC
}

const AppRoot: FC = () => {
  const [theme, setTheme] = useState<FullTheme>(defaultTheme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const isLight = theme === LIGHT_THEME

  return (
    <ThemeProvider theme={theme} setTheme={setTheme} isLightTheme={isLight}>
      <TranslationProvider>
        <TooltipProvider>
          <DialogProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={
                    <Sidebar.Provider>
                      <App.Shell />
                    </Sidebar.Provider>
                  }
                />
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

const App = Object.assign(AppRoot, {
  Shell: AppShell,
  Nav: AppNav,
  Content: AppContent
}) as AppNamespace

export default App
