import {
  ComponentProps,
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementRef,
  forwardRef,
  MouseEvent,
  useCallback,
  useMemo,
  useState
} from 'react'

import {
  Button,
  IconV2,
  IconV2NamesType,
  Layout,
  ScrollArea,
  Separator,
  Sheet,
  Text,
  useScrollArea
} from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

import { AnimatedSideBarRail } from './animated-sidebar-rail'
import { useSidebar } from './sidebar-context'

export const SidebarRoot = forwardRef<HTMLDivElement, ComponentProps<'div'> & { side?: 'left' | 'right' }>(
  ({ side = 'left', className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <Sheet.Content
            data-mobile="true"
            className="cn-sidebar !pointer-events-auto"
            side={side}
            hideCloseButton
            modal={false}
          >
            {children}
          </Sheet.Content>
        </Sheet.Root>
      )
    }

    return (
      <div ref={ref} className={cn('group peer cn-sidebar-root-responsive')} data-state={state} data-side={side}>
        <div className={cn('cn-sidebar cn-sidebar-desktop', className)} data-state={state} {...props}>
          {children}
        </div>
      </div>
    )
  }
)
SidebarRoot.displayName = 'SidebarRoot'

type SidebarTriggerProp = Omit<ComponentProps<typeof Button>, 'iconOnly' | 'tooltipProps' | 'ignoreIconOnlyTooltip'>

export const SidebarTrigger = forwardRef<ElementRef<typeof Button>, SidebarTriggerProp>(
  ({ onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    const { t } = useTranslation()

    const onClickHandler = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        toggleSidebar()
      },
      [onClick, toggleSidebar]
    )

    return (
      <Button
        ref={ref}
        size="xs"
        variant="ghost"
        iconOnly
        onClick={onClickHandler}
        tooltipProps={{
          content: t('component:sidebar.toggle', 'Toggle sidebar')
        }}
        {...props}
      >
        <IconV2 name="sidebar" />
        <span className="sr-only">{t('component:sidebar.toggle', 'Toggle sidebar')}</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

export const SidebarRail = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & { open?: boolean; animate?: boolean }
>(({ className, onClick, open, animate = false, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      toggleSidebar()
    },
    [toggleSidebar, onClick]
  )

  const label = open ? t('component:sidebar.collapse', 'Collapse') : t('component:sidebar.expand', 'Expand')

  if (animate) {
    return <AnimatedSideBarRail className={className} />
  }

  return (
    <button
      data-id="sidebar-rail"
      ref={ref}
      aria-label={label}
      title={label}
      tabIndex={-1}
      onClick={onClickHandler}
      className={cn('cn-sidebar-rail', open ? 'cursor-w-resize' : 'cursor-e-resize', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <div className={cn('absolute top-[calc(50%-var(--cn-header-height))] right-0', { 'translate-x-1/2': hovered })}>
        {hovered ? (
          <IconV2 name={open ? 'nav-arrow-left' : 'nav-arrow-right'} size="lg" />
        ) : (
          <Text className="cn-pl-1 pl-cn-4xs">|</Text>
        )}
      </div>
    </button>
  )
})
SidebarRail.displayName = 'SidebarRail'

export const SidebarInset = forwardRef<HTMLDivElement, ComponentProps<'main'>>(({ className, ...props }, ref) => {
  return <main ref={ref} className={cn('cn-sidebar-inset', className)} {...props} />
})
SidebarInset.displayName = 'SidebarInset'

export const SidebarHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('cn-sidebar-header', className)} {...props} />
})
SidebarHeader.displayName = 'SidebarHeader'

export const SidebarFooter = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('cn-sidebar-footer', className)} {...props} />
})
SidebarFooter.displayName = 'SidebarFooter'

export const SidebarSeparator = forwardRef<ElementRef<typeof Separator>, ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => <Separator ref={ref} className={cn('cn-sidebar-separator', className)} {...props} />
)
SidebarSeparator.displayName = 'SidebarSeparator'

export const SidebarContent = (props: ComponentProps<typeof ScrollArea>) => {
  const { isTop, isBottom, onScrollTop, onScrollBottom } = useScrollArea(props)
  const { className } = props

  return (
    <div
      className={cn(
        'cn-sidebar-content-wrapper',
        { 'cn-sidebar-content-wrapper-top': isTop, 'cn-sidebar-content-wrapper-bottom': isBottom },
        className
      )}
    >
      <ScrollArea
        {...props}
        onScrollTop={onScrollTop}
        onScrollBottom={onScrollBottom}
        className="cn-sidebar-content"
        role="menu"
      />
    </div>
  )
}

export interface SidebarGroupProps extends ComponentPropsWithoutRef<'div'> {
  label?: string
  actionIcon?: IconV2NamesType
  onActionClick?: () => void
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, children, label, actionIcon = 'list', onActionClick, ...props }, ref) => (
    <div ref={ref} role="group" className={cn('cn-sidebar-group', className)} {...props}>
      {label && (
        <Layout.Horizontal className="cn-sidebar-group-header" align="center" justify="between">
          <Text variant="caption-single-line-normal" as="h6" className="cn-sidebar-group-label" color="foreground-3">
            {label}
          </Text>
          {onActionClick && (
            <Button
              className="cn-sidebar-group-header-action-button"
              size="xs"
              iconOnly
              onClick={onActionClick}
              variant="ghost"
            >
              <IconV2 size="xs" name={actionIcon} />
            </Button>
          )}
        </Layout.Horizontal>
      )}
      {children}
    </div>
  )
)
SidebarGroup.displayName = 'SidebarGroup'

export const SidebarMenuSkeleton = forwardRef<HTMLDivElement, ComponentProps<'div'> & { hideIcon?: boolean }>(
  ({ className, hideIcon = false, ...props }, ref) => {
    const { state } = useSidebar()
    const collapsed = state === 'collapsed'
    // Random width between 50 to 90%.
    const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, [])

    return (
      <div ref={ref} className={cn('cn-sidebar-item-skeleton', className)} {...props}>
        {(!hideIcon || collapsed) && <div className="cn-sidebar-item-skeleton-icon" />}
        {!collapsed && (
          <div
            className="cn-sidebar-item-skeleton-text"
            style={{ '--cn-sidebar-skeleton-width': width } as CSSProperties}
          />
        )}
      </div>
    )
  }
)
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'
