import { type FC, Fragment, type MouseEvent, useMemo, useState } from 'react'

import {
  Drawer,
  DropdownMenu,
  IconV2,
  Input,
  Layout,
  Sidebar,
  Text,
  useSidebar,
  type DrawerContentProps
} from '@harnessio/ui/components'
import { useRouterContext, useTheme, type FullTheme } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import {
  DEFAULT_MORE_DRAWER_PREVIEW_COUNT,
  type AppNavMoreItemGroup,
  type AppNavProps
} from './types/app-nav-types'

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

const moreDrawerToggleMoreLabel = 'More'
const moreDrawerToggleLessLabel = 'Less'

const moreDrawerDirection = 'left' as const
const moreDrawerBodyContentClass = 'more-drawer'
const moreDrawerNavRowClass = 'more-drawer-row'
const moreDrawerGroupItemsClass = 'more-drawer-group-items'
const moreDrawerLayoutColumn = 'column' as const
const moreDrawerLayoutGap = 'none' as const
const moreDrawerSearchInputIcon = 'search' as const
const moreDrawerInputWrapperClass = 'w-full'

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

const MoreDrawerSectionGroup: FC<{ section: AppNavMoreItemGroup }> = ({ section }) => {
  const { groupId, label, defaultExpanded, items } = section
  const previewCount = section.previewCount ?? DEFAULT_MORE_DRAWER_PREVIEW_COUNT
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

function fixedItemKey(entry: AppNavProps['fixedItems'][number], index: number): string {
  if (entry.type === 'more') {
    return entry.id
  }
  const { item } = entry
  if ('to' in item && item.to) {
    return String(item.to)
  }
  return item.title ?? `fixed-${index}`
}

/** Full-height nav column: sidebar + rail (single grid cell beside main). */
export const AppNav: FC<AppNavProps> = ({ headerItem, fixedItems, recentSection }) => {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'
  const [openMoreId, setOpenMoreId] = useState<string | null>(null)

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
      onPointerDownOutside: () => setOpenMoreId(null)
    }),
    [isSidebarCollapsed]
  )

  return (
    <div className="app-shell-nav-column relative flex h-full min-h-0 min-w-0">
      <div className="sidebar-app-shell h-full min-h-0 min-w-0 flex-1">
        <Sidebar.Root className="sidebar-app-figma">
          <Sidebar.Header className="sidebar-app-sidebar-header">
            <Sidebar.Item {...headerItem} />
          </Sidebar.Header>

          <Sidebar.Group className="sidebar-app-sidebar-group-pinned">
            {fixedItems.map((entry, index) => {
              if (entry.type === 'item') {
                return (
                  <Sidebar.Item key={fixedItemKey(entry, index)} {...entry.item}>
                    {entry.children}
                  </Sidebar.Item>
                )
              }

              const searchId = entry.drawerSearchInputId ?? `${entry.id}-search`
              const searchLabel = entry.drawerSearchPlaceholder?.trim()
                ? entry.drawerSearchPlaceholder
                : 'Search'

              return (
                <Drawer.Root
                  key={entry.id}
                  direction={moreDrawerDirection}
                  open={openMoreId === entry.id}
                  onOpenChange={open => setOpenMoreId(open ? entry.id : null)}
                >
                  <Sidebar.Item
                    {...entry.trigger}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      entry.trigger.onClick?.(e)
                      setOpenMoreId(entry.id)
                    }}
                  />
                  <Drawer.Content {...moreMenuDrawerContentProps}>
                    <Drawer.Title className="sr-only">{entry.trigger.title}</Drawer.Title>
                    <Drawer.Description className="sr-only">{entry.trigger.title}</Drawer.Description>
                    <Drawer.Body classNameContent={moreDrawerBodyContentClass}>
                      <Layout.Flex direction={moreDrawerLayoutColumn} gap={moreDrawerLayoutGap}>
                        <div className="more-drawer-search">
                          <Input
                            id={searchId}
                            inputIconName={moreDrawerSearchInputIcon}
                            placeholder={entry.drawerSearchPlaceholder ?? ''}
                            wrapperClassName={moreDrawerInputWrapperClass}
                            aria-label={searchLabel}
                          />
                        </div>
                        <Sidebar.Separator />
                        {entry.itemGroups.map((group, sectionIndex) => (
                          <Fragment key={group.groupId}>
                            <MoreDrawerSectionGroup section={group} />
                            {sectionIndex < entry.itemGroups.length - 1 ? <Sidebar.Separator /> : null}
                          </Fragment>
                        ))}
                      </Layout.Flex>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Root>
              )
            })}
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Content>
            {recentSection ? (
              <Sidebar.Group label={recentSection.label} className="sidebar-app-sidebar-group-recent">
                {'items' in recentSection
                  ? recentSection.items.map((item, itemIndex) => (
                      <Sidebar.Item
                        key={
                          'to' in item && item.to
                            ? String(item.to)
                            : `${item.title ?? 'item'}-${itemIndex}`
                        }
                        {...item}
                      />
                    ))
                  : recentSection.children}
              </Sidebar.Group>
            ) : null}
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
