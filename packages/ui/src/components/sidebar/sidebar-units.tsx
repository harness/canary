import {
  ComponentProps,
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementRef,
  forwardRef,
  MouseEvent,
  useCallback,
  useMemo
} from 'react'

import { Button, IconV2, ScrollArea, Separator, Sheet, Text, useScrollArea } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

import { useSidebar } from './sidebar-context'

export const SidebarRoot = forwardRef<HTMLDivElement, ComponentProps<'div'> & { side?: 'left' | 'right' }>(
  ({ side = 'left', className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <Sheet.Content data-mobile="true" className="cn-sidebar" side={side} hideCloseButton modal={false}>
            {children}
          </Sheet.Content>
        </Sheet.Root>
      )
    }

    return (
      <div ref={ref} className={cn('group peer hidden md:block')} data-state={state} data-side={side}>
        <div className={cn('cn-sidebar cn-sidebar-desktop', className)} data-state={state} {...props}>
          {children}
        </div>
      </div>
    )
  }
)
SidebarRoot.displayName = 'SidebarRoot'

export const SidebarTrigger = forwardRef<ElementRef<typeof Button>, ComponentProps<typeof Button>>(
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
      <Button ref={ref} size="xs" variant="ghost" iconOnly onClick={onClickHandler} {...props}>
        <IconV2 name="sidebar" />
        <span className="sr-only">{t('component:sidebar.toggle', 'Toggle sidebar')}</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

export const SidebarRail = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(({ className, ...props }, ref) => {
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
        // classNameContent="w-full"
        role="menu"
      />
    </div>
  )
}

export interface SidebarGroupProps extends ComponentPropsWithoutRef<'div'> {
  label?: string
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, children, label, ...props }, ref) => (
    <div ref={ref} role="group" className={cn('cn-sidebar-group', className)} {...props}>
      {label && (
        <Text variant="caption-single-line-normal" as="h6" className="cn-sidebar-group-label" color="foreground-3">
          {label}
        </Text>
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
