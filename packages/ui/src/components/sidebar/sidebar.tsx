import {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  CSSProperties,
  ElementRef,
  forwardRef,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Avatar,
  AvatarProps,
  Button,
  DropdownMenu,
  DropdownMenuItemProps,
  IconPropsV2,
  IconV2,
  Layout,
  LogoPropsV2,
  LogoV2,
  ScrollArea,
  Separator,
  Sheet,
  Skeleton,
  StatusBadge,
  StatusBadgeProps,
  Text,
  Tooltip,
  TooltipProvider
} from '@/components'
import { NavLinkProps, useRouterContext, useTranslation } from '@/context'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import omit from 'lodash-es/omit'

import { useIsMobile } from './use-is-mobile'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = 'var(--cn-size-56)'
const SIDEBAR_COLLAPSED_WIDTH = 'var(--cn-size-14)'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

export type SidebarContext = {
  state: 'expanded' | 'collapsed'
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

const SidebarProvider = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = useMemo<SidebarContext>(
    () => ({ state, collapsed: !open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  useEffect(() => {
    if (isMobile) return

    if (open) {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_WIDTH)
    } else {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_COLLAPSED_WIDTH)
    }

    return () => {
      document.body.style.removeProperty('--cn-sidebar-width')
    }
  }, [open, isMobile])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div className={cn('cn-sidebar-wrapper', className)} ref={ref} {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = 'SidebarProvider'

const SidebarRoot = forwardRef<HTMLDivElement, ComponentProps<'div'> & { side?: 'left' | 'right' }>(
  ({ side = 'left', className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <Sheet.Content
            data-mobile="true"
            className="cn-sidebar"
            style={{ '--cn-sidebar-width': SIDEBAR_WIDTH } as CSSProperties}
            side={side}
            hideCloseButton
          >
            {children}
          </Sheet.Content>
        </Sheet.Root>
      )
    }

    return (
      <div ref={ref} className={cn('group peer hidden md:block')} data-state={state} data-side={side}>
        <div className={cn('cn-sidebar cn-sidebar-desktop', className)} {...props}>
          {children}
        </div>
      </div>
    )
  }
)
SidebarRoot.displayName = 'SidebarRoot'

const SidebarTrigger = forwardRef<ElementRef<typeof Button>, ComponentProps<typeof Button>>(
  ({ onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    const { t } = useTranslation()

    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        toggleSidebar()
      },
      [onClick, toggleSidebar]
    )

    return (
      <Button ref={ref} size="xs" variant="ghost" iconOnly onClick={onClickHandler} {...props}>
        <IconV2 name="sidebar" />
        <span className="sr-only">{t('component:sidebar.toggle', 'Toggle sidebar')}</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

const SidebarRail = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  const { t } = useTranslation()

  return (
    <button
      ref={ref}
      aria-label={t('component:sidebar.toggle', 'Toggle sidebar')}
      tabIndex={-1}
      onClick={toggleSidebar}
      title={t('component:sidebar.toggle', 'Toggle sidebar')}
      className={cn('cn-sidebar-rail', className)}
      {...props}
    />
  )
})
SidebarRail.displayName = 'SidebarRail'

const SidebarInset = forwardRef<HTMLDivElement, ComponentProps<'main'>>(({ className, ...props }, ref) => {
  return <main ref={ref} className={cn('cn-sidebar-inset', className)} {...props} />
})
SidebarInset.displayName = 'SidebarInset'

const SidebarHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('cn-sidebar-header', className)} {...props} />
})
SidebarHeader.displayName = 'SidebarHeader'

const SidebarFooter = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('cn-sidebar-footer', className)} {...props} />
})
SidebarFooter.displayName = 'SidebarFooter'

const SidebarSeparator = forwardRef<ElementRef<typeof Separator>, ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => <Separator ref={ref} className={cn('cn-sidebar-separator', className)} {...props} />
)
SidebarSeparator.displayName = 'SidebarSeparator'

const SidebarContent = ({ children, ...props }: ComponentProps<typeof ScrollArea>) => (
  <ScrollArea {...props} className="h-full" classNameContent="w-full" role="menu">
    {children}
  </ScrollArea>
)

interface SidebarGroupProps extends ComponentPropsWithoutRef<'div'> {
  label?: string
}

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(({ className, children, label, ...props }, ref) => {
  return (
    <div ref={ref} role="group" className={cn('cn-sidebar-group', className)} {...props}>
      {label && (
        <Text variant="caption-single-line-normal" as="h6" className="cn-sidebar-group-label" color="foreground-3">
          {label}
        </Text>
      )}
      {children}
    </div>
  )
})
SidebarGroup.displayName = 'SidebarGroup'

interface SidebarItemBaseProps extends ComponentPropsWithoutRef<'button'> {
  title: string
  description?: string
  isActive?: boolean
  tooltip?: ReactNode
  badgeProps?: { content?: ReactNode; icon?: StatusBadgeProps['icon'] }
  actionMenuItems?: DropdownMenuItemProps[]
  dropdownMenuContent?: ReactNode
}

interface SidebarItemIconProps extends SidebarItemBaseProps {
  icon?: IconPropsV2['name']
  logo?: never
  avatar?: never
}

interface SidebarItemLogoProps extends SidebarItemBaseProps {
  logo?: LogoPropsV2['name']
  icon?: never
  avatar?: never
}

interface SidebarItemAvatarProps extends SidebarItemBaseProps {
  avatarFallback?: AvatarProps['name']
  src?: AvatarProps['src']
  logo?: never
  icon?: never
}

type SidebarItemExtendedProps = SidebarItemIconProps | SidebarItemLogoProps | SidebarItemAvatarProps

type SidebarItemButtonProps = SidebarItemExtendedProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof SidebarItemExtendedProps>

type SidebarItemLinkProps = SidebarItemExtendedProps & NavLinkProps

type SidebarItemProps = Omit<SidebarItemButtonProps | SidebarItemLinkProps, 'children'>

interface TabsTriggerComponent {
  (props: SidebarItemButtonProps): JSX.Element
  (props: SidebarItemLinkProps): JSX.Element
  displayName?: string
}

const itemIsIcon = (item: SidebarItemProps): item is SidebarItemIconProps => !!(item as SidebarItemIconProps).icon
const itemIsLogo = (item: SidebarItemProps): item is SidebarItemLogoProps => !!(item as SidebarItemLogoProps).logo
const itemIsAvatar = (item: SidebarItemProps): item is SidebarItemAvatarProps =>
  !!(item as SidebarItemAvatarProps).src || !!(item as SidebarItemAvatarProps).avatarFallback
const isSidebarItemLink = (item: SidebarItemProps): item is SidebarItemLinkProps =>
  'to' in item && (item as SidebarItemLinkProps).to !== undefined

const SidebarItem = (({ className, ...props }: SidebarItemProps) => {
  const { state } = useSidebar()
  const { NavLink } = useRouterContext()
  const withIcon = itemIsIcon(props)
  const withLogo = itemIsLogo(props)
  const withAvatar = itemIsAvatar(props)
  const isLink = isSidebarItemLink(props)

  const { title, description, actionMenuItems, dropdownMenuContent, badgeProps, tooltip, ...restProps } = props
  const withDescription = !!description
  const withActionMenu = state === 'expanded' && !!actionMenuItems && actionMenuItems.length > 0
  const withDropdownMenu = !!dropdownMenuContent
  const withRightElement = withActionMenu || withDropdownMenu

  const iconSize = withDescription ? 'lg' : 'sm'

  const Content = () => (
    <>
      <Layout.Grid
        className={cn('cn-sidebar-item-content', {
          'cn-sidebar-item-content-w-description': withDescription,
          'cn-sidebar-item-content-w-r-element': withRightElement,
          'cn-sidebar-item-content-complete': withDescription && withRightElement
        })}
      >
        {withIcon && props.icon && (
          <IconV2 name={props.icon} size={iconSize} className="cn-sidebar-item-content-icon" />
        )}
        {withLogo && props.logo && (
          <LogoV2 name={props.logo} size={iconSize} className="cn-sidebar-item-content-icon" />
        )}
        {withAvatar && (
          <Avatar
            src={props.src}
            name={props.avatarFallback}
            size={iconSize}
            className="cn-sidebar-item-content-icon"
          />
        )}

        <Text
          variant="body-single-line-strong"
          color={withDescription ? 'foreground-1' : 'foreground-2'}
          className="cn-sidebar-item-content-title"
          truncate
        >
          {title}
        </Text>
        {withDescription && (
          <Text
            variant="caption-single-line-soft"
            color="foreground-3"
            className="cn-sidebar-item-content-description"
            truncate
          >
            {description}
          </Text>
        )}

        {withDropdownMenu && <IconV2 name="up-down" size="xs" className="cn-sidebar-item-content-right-element" />}

        {badgeProps && (
          <StatusBadge
            variant="outline"
            theme="info"
            {...omit(badgeProps, ['content'])}
            className="cn-sidebar-item-content-right-element"
          >
            {badgeProps.content}
          </StatusBadge>
        )}

        {withActionMenu && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="cn-sidebar-item-action-menu cn-sidebar-item-content-right-element">
              <IconV2 name="more-vert" size="xs" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="right" align="end" sideOffset={4}>
              {actionMenuItems?.map((item, index) => <DropdownMenu.Item key={index} {...item} />)}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </Layout.Grid>
    </>
  )

  const itemProps = omit(restProps, ['icon', 'logo', 'avatarFallback', 'src', 'badgeProps'])

  const Item = () => (
    <>
      {isLink && (
        <NavLink className={cn('cn-sidebar-item', className)} role="menuitem" {...(itemProps as SidebarItemLinkProps)}>
          <Content />
        </NavLink>
      )}

      {withDropdownMenu && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={cn('cn-sidebar-item', className)} {...itemProps} role="menuitem">
            <Content />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="right" align="end" sideOffset={3} alignOffset={4}>
            {dropdownMenuContent}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      {!isLink && !withDropdownMenu && (
        <button className={cn('cn-sidebar-item', className)} {...itemProps} role="menuitem">
          <Content />
        </button>
      )}
    </>
  )

  if (tooltip) {
    return (
      <Tooltip side="right" hideArrow content={tooltip}>
        <Item />
      </Tooltip>
    )
  }

  return <Item />
}) as TabsTriggerComponent
SidebarItem.displayName = 'SidebarItem'

const SidebarMenuSkeleton = forwardRef<HTMLDivElement, ComponentProps<'div'> & { showIcon?: boolean }>(
  ({ className, showIcon = false, ...props }, ref) => {
    // Random width between 50 to 90%.
    const width = useMemo(() => {
      return `${Math.floor(Math.random() * 40) + 50}%`
    }, [])

    return (
      <div ref={ref} className={cn('rounded-md h-8 flex gap-2 px-2 items-center', className)} {...props}>
        {showIcon && <Skeleton className="size-4 rounded-md" />}
        <Skeleton
          className="h-4 max-w-[--skeleton-width] flex-1"
          style={{ '--skeleton-width': width } as CSSProperties}
        />
      </div>
    )
  }
)
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

const SidebarMenuSub = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = 'SidebarMenuSub'

const SidebarMenuSubItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
))
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

const SidebarMenuSubButton = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & { asChild?: boolean; isActive?: boolean }
>(({ asChild = false, isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        'text-sm',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

interface SidebarToggleMenuButtonProps {
  text?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

const SidebarToggleMenuButton = ({ text, onClick }: SidebarToggleMenuButtonProps) => {
  const { toggleSidebar, state } = useSidebar()
  const { t } = useTranslation()

  const collapsed = state === 'collapsed'

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      toggleSidebar()
      event.stopPropagation()
    },
    [onClick, toggleSidebar]
  )

  return (
    <SidebarItem
      onClick={handleClick}
      title={text ?? t('component:sidebar.sidebarToggle.collapse', 'Collapse')}
      icon={collapsed ? 'expand-sidebar' : 'collapse-sidebar'}
      aria-label={
        collapsed
          ? t('component:sidebar.sidebarToggle.expand', 'Expand')
          : t('component:sidebar.sidebarToggle.collapse', 'Collapse')
      }
    />
  )
}

const Sidebar = {
  Root: SidebarRoot,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Header: SidebarHeader,
  Inset: SidebarInset,
  Item: SidebarItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  ToggleMenuButton: SidebarToggleMenuButton
}

export { Sidebar, useSidebar, SidebarItemProps }
