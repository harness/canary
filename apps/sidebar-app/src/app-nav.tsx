import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type FC, Fragment, type MouseEvent, useCallback, useMemo, useState } from 'react'

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
  type AppNavFixedItem,
  type AppNavFixedItemMore,
  type AppNavFixedItemRow,
  type AppNavFixedItemRowWithSortable,
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

function partitionFixedItemsForSortable(items: AppNavFixedItem[]): {
  prefix: AppNavFixedItem[]
  sortable: AppNavFixedItemRowWithSortable[]
  suffix: AppNavFixedItem[]
} {
  const runs: { start: number; end: number }[] = []
  let runStart = -1
  for (let i = 0; i <= items.length; i++) {
    const e = items[i]
    const isSort = !!(e && e.type === 'item' && e.sortableId != null && e.sortableId !== '')
    if (isSort) {
      if (runStart < 0) runStart = i
    } else if (runStart >= 0) {
      runs.push({ start: runStart, end: i - 1 })
      runStart = -1
    }
  }
  if (runs.length === 0) {
    return { prefix: items, sortable: [], suffix: [] }
  }
  if (runs.length > 1) {
    console.warn(
      'AppNav: multiple contiguous sortable fixed-item runs are not supported; using the first run only'
    )
  }
  const { start, end } = runs[0]
  const sortable = items.slice(start, end + 1).filter(
    (e): e is AppNavFixedItemRowWithSortable =>
      e.type === 'item' &&
      typeof (e as AppNavFixedItemRow).sortableId === 'string' &&
      (e as AppNavFixedItemRow).sortableId !== ''
  )
  return {
    prefix: items.slice(0, start),
    sortable,
    suffix: items.slice(end + 1)
  }
}

function defaultShowFixedItemDragGrip(_row: AppNavFixedItemRow): boolean {
  return true
}

const SortableFixedSidebarRow: FC<{
  entry: AppNavFixedItemRowWithSortable
  showGrip: boolean
}> = ({ entry, showGrip }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.sortableId,
    disabled: !showGrip
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : undefined,
    zIndex: isDragging ? 1 : undefined
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Sidebar.Item
        {...entry.item}
        draggable={showGrip}
        dragAttributes={showGrip ? attributes : undefined}
        dragListeners={showGrip ? listeners : undefined}
      >
        {entry.children}
      </Sidebar.Item>
    </div>
  )
}

/** Full-height nav column: sidebar + rail (single grid cell beside main). */
export const AppNav: FC<AppNavProps> = ({
  headerItem,
  fixedItems,
  recentSection,
  onReorderSortableFixedItems,
  showFixedItemDragGrip = defaultShowFixedItemDragGrip
}) => {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'
  const [openMoreId, setOpenMoreId] = useState<string | null>(null)

  const { prefix, sortable, suffix } = useMemo(
    () => partitionFixedItemsForSortable(fixedItems),
    [fixedItems]
  )

  const sortableIds = useMemo(() => sortable.map(s => s.sortableId), [sortable])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 }
    })
  )

  const handleSortableDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!onReorderSortableFixedItems || sortableIds.length === 0) return
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = sortableIds.indexOf(active.id as string)
      const newIndex = sortableIds.indexOf(over.id as string)
      if (oldIndex < 0 || newIndex < 0) return
      onReorderSortableFixedItems(arrayMove(sortableIds, oldIndex, newIndex))
    },
    [onReorderSortableFixedItems, sortableIds]
  )

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

  const renderMoreFixedItem = (entry: AppNavFixedItemMore) => {
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
  }

  const renderFixedSegment = (segment: AppNavFixedItem[], keyGroup: number) =>
    segment.map((entry, i) => {
      if (entry.type === 'item') {
        return (
          <Sidebar.Item key={`${keyGroup}-${fixedItemKey(entry, i)}`} {...entry.item}>
            {entry.children}
          </Sidebar.Item>
        )
      }
      return renderMoreFixedItem(entry)
    })

  const sortableEnabled =
    sortable.length > 0 && typeof onReorderSortableFixedItems === 'function'

  return (
    <div className="app-shell-nav-column relative flex h-full min-h-0 min-w-0">
      <div className="sidebar-app-shell h-full min-h-0 min-w-0 flex-1">
        <Sidebar.Root className="sidebar-app-figma">
          <Sidebar.Header className="sidebar-app-sidebar-header">
            <Sidebar.Item {...headerItem} />
          </Sidebar.Header>

          <Sidebar.Group className="sidebar-app-sidebar-group-pinned">
            {renderFixedSegment(prefix, 0)}
            {sortableEnabled ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSortableDragEnd}
              >
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  {sortable.map(entry => {
                    const showGrip = showFixedItemDragGrip(entry)
                    return (
                      <SortableFixedSidebarRow
                        key={entry.sortableId}
                        entry={entry}
                        showGrip={showGrip}
                      />
                    )
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              sortable.map((entry, i) => (
                <Sidebar.Item key={`o-${fixedItemKey(entry, i)}`} {...entry.item}>
                  {entry.children}
                </Sidebar.Item>
              ))
            )}
            {renderFixedSegment(suffix, 1)}
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
