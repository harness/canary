import {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  CSSProperties,
  ElementRef,
  forwardRef,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { Button, Icon, Input, ScrollArea, Sheet, Tooltip } from '@/components'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { Separator } from './separator'
import { Skeleton } from './skeleton'
import { useIsMobile } from './use-is-mobile'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '228px'
const SIDEBAR_COLLAPSED_WIDTH = '62px'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

export type SidebarContext = {
  state: 'expanded' | 'collapsed'
  collapsed: boolean
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
  ComponentProps<'div'> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
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
    () => ({
      state,
      collapsed: !open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  useEffect(() => {
    if (isMobile) return

    document.body.style.setProperty('--cn-sidebar-width-icon', SIDEBAR_WIDTH_ICON)

    if (!open) {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_COLLAPSED_WIDTH)
    }

    if (open) {
      document.body.style.setProperty('--cn-sidebar-width', SIDEBAR_WIDTH)
    }

    return () => {
      document.body.style.removeProperty('--cn-sidebar-width')
    }
  }, [open, isMobile])

  return (
    <SidebarContext.Provider value={contextValue}>
      <Tooltip.Provider delayDuration={0}>
        <div
          className={cn(
            'group/sidebar-wrapper flex justify-between w-full has-[[data-variant=inset]]:bg-sidebar',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = 'SidebarProvider'

const SidebarRoot = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
  }
>(({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'flex h-full w-[--cn-sidebar-width] flex-col bg-cn-background-0 transition-[width] ease-linear duration-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <Sheet.Content
          data-sidebar="sidebar"
          data-mobile="true"
          className="bg-cn-background-0 w-[--cn-sidebar-width] p-0 [&>button]:hidden"
          style={{ '--cn-sidebar-width': SIDEBAR_WIDTH_MOBILE } as CSSProperties}
          side={side}
        >
          <div className="flex size-full flex-col">{children}</div>
        </Sheet.Content>
      </Sheet.Root>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('group peer hidden md:block')}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          'sticky top-0 bg-cn-background-0 border-sidebar-border-1 duration-200 hidden w-[--cn-sidebar-width] transition-[left,right,width] ease-linear md:flex',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--cn-sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'group-data-[collapsible=icon]:w-[--cn-sidebar-width-icon]',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="group-data-[variant=floating]:border-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  )
})
SidebarRoot.displayName = 'SidebarRoot'

const SidebarTrigger = forwardRef<ElementRef<typeof Button>, ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn('h-7 w-7 focus:ring-0 focus-visible:outline-none', className)}
        onClick={event => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <Icon name="sidebar-mobile" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

const SidebarRail = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute bg-transparent inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = 'SidebarRail'

const SidebarInset = forwardRef<HTMLDivElement, ComponentProps<'main'>>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        'relative min-h-screen bg-cn-background-0 w-full',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow transition-[max-width] ease-linear duration-200',
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = 'SidebarInset'

const SidebarInput = forwardRef<ElementRef<typeof Input>, ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          'h-8 w-full bg-cn-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarInput.displayName = 'SidebarInput'

const SidebarHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn('flex flex-col gap-2 px-3.5', className)} {...props} />
})
SidebarHeader.displayName = 'SidebarHeader'

const SidebarFooter = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} data-sidebar="footer" className={cn('flex flex-col gap-2 px-2 pt-2.5 pb-2', className)} {...props} />
  )
})
SidebarFooter.displayName = 'SidebarFooter'

const SidebarSeparator = forwardRef<ElementRef<typeof Separator>, ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn('mx-2 w-auto bg-sidebar-border', className)}
        {...props}
      />
    )
  }
)
SidebarSeparator.displayName = 'SidebarSeparator'

const SidebarContent = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-hidden group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    >
      <ScrollArea scrollThumbClassName="bg-sidebar-background-8">{children}</ScrollArea>
    </div>
  )
})
SidebarContent.displayName = 'SidebarContent'

const SidebarGroup = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col py-2 px-3.5 border-sidebar-border-1', className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = 'SidebarGroup'

const SidebarGroupLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          'flex h-8 shrink-0 items-center rounded-md px-2 mb-2 text-2 text-sidebar-foreground-5 outline-none ring-sidebar-ring opacity-1 transition-[height,opacity,margin-bottom] duration-150 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:mb-0 group-data-[state=collapsed]:h-0',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

const SidebarGroupAction = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          // Increases the hit area of the button on mobile.
          'after:absolute after:-inset-2 after:md:hidden',
          'group-data-[collapsible=icon]:hidden',
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupAction.displayName = 'SidebarGroupAction'

const SidebarGroupContent = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="group-content" className={cn('w-full text-sm', className)} {...props} />
))
SidebarGroupContent.displayName = 'SidebarGroupContent'

const SidebarMenu = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn('flex w-full min-w-0 flex-col gap-0.5', className)} {...props} />
))
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn('group/menu-item relative', className)} {...props} />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = cva(
  'peer/menu-button group-hover/menu-item:bg-sidebar-background-3 data-[active=true]:bg-sidebar-background-3 data-[state=open]:hover:bg-sidebar-background-3 flex w-full cursor-pointer items-center overflow-hidden rounded px-2.5 py-2 text-left text-sm outline-none transition-[width,height,padding] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-7 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        outline:
          'bg-cn-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-2',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const SidebarMenuButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | ComponentProps<typeof Tooltip.Content>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = 'default', size = 'default', tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      ref={ref}
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip
    }
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content side="right" align="center" hidden={state !== 'collapsed' || isMobile} {...tooltip} />
    </Tooltip.Root>
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'

const SidebarMenuItemText = forwardRef<
  HTMLDivElement,
  {
    icon?: ReactElement<SVGSVGElement>
    text: string
    className?: string
    active?: boolean
  }
>(({ icon, text, className, active = false, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex items-center select-none pl-2.5 w-full', className)} {...props}>
      {icon && (
        <div
          className={cn(
            'text-sidebar-icon-3 group-hover/menu-item:text-sidebar-icon-1 relative z-10 flex mr-2 h-3.5 w-3.5 min-w-3.5 items-center duration-100 ease-in-out',
            { 'text-sidebar-icon-1': !!active }
          )}
        >
          {!!active && <span className="absolute left-1/2 top-1/2 z-[-1] size-7 -translate-x-1/2 -translate-y-1/2" />}
          {icon}
        </div>
      )}
      <span
        className={cn(
          // 14px - icon size, 8px - gap. This makes truncate work well
          'max-w-[calc(100%-14px-8px)] w-full truncate',
          'font-medium text-sidebar-foreground-2 whitespace-nowrap group-hover/menu-item:text-sidebar-foreground-1 z-10 text-left transition-[opacity,max-width,margin] duration-100 ease-in-out group-data-[state=collapsed]:duration-150 group-data-[state=collapsed]:ease-linear group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:ml-0',
          { 'text-sidebar-foreground-1': active }
        )}
      >
        {text}
      </span>
    </div>
  )
})
SidebarMenuItemText.displayName = 'SidebarMenuItemText'

const SidebarMenuAction = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'absolute right-3 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-3 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        {
          'opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0':
            showOnHover
        },
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = 'SidebarMenuAction'

const SidebarMenuBadge = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      'absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-2 font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

const SidebarMenuSkeleton = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn('rounded-md h-8 flex gap-2 px-2 items-center', className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ '--skeleton-width': width } as CSSProperties}
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

const SidebarMenuSub = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
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
  ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
    size?: 'sm' | 'md'
    isActive?: boolean
  }
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-2',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

const Sidebar = {
  Root: SidebarRoot,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  GroupLabel: SidebarGroupLabel,
  Header: SidebarHeader,
  Input: SidebarInput,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: SidebarMenuButton,
  MenuItemText: SidebarMenuItemText,
  MenuItem: SidebarMenuItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger
}

export { Sidebar, useSidebar }
