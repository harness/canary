import { FC, Fragment, ReactNode } from 'react'

import { Layout, Link, ScrollArea, Separator, Text } from '@/components'
import { INSET_LAYOUT_INDENT, useRouterContext } from '@/context'
import { cn } from '@utils/cn'

const BREADCRUMBS_HEIGHT = 55

export interface SidebarMenuItemSubItem {
  id: string | number
  title: string
  to: string
  description?: string
}

export interface SidebarMenuItem {
  groupId: number | string
  title?: string
  items: SidebarMenuItemSubItem[]
}

export interface ContentLayoutWithSidebarProps {
  children: ReactNode
  sidebarMenu: SidebarMenuItem[]
  sidebarOffsetTop?: number
  // You need to pass the padding-top value, which is the initial offset of the sidebar from the top of the visible area.
  // This is required to ensure that scrolling within the block goes beyond the boundary
  // while the block maintains the correct top padding according to the design.
  sidebarViewportClassName?: string
  showBackButton?: boolean
  backButtonLabel?: string
  backButtonTo?: () => string
}

export const ContentLayoutWithSidebar: FC<ContentLayoutWithSidebarProps> = ({
  children,
  sidebarMenu,
  sidebarOffsetTop = 0,
  sidebarViewportClassName,
  showBackButton = false,
  backButtonLabel = 'Back',
  backButtonTo
}) => {
  const { NavLink } = useRouterContext()

  return (
    <div className="relative mx-auto flex h-full w-full items-start gap-x-20 pr-4">
      <div
        className="sticky w-[220px]"
        style={{
          top: `${sidebarOffsetTop}px`,
          height: `calc(100svh - ${sidebarOffsetTop + BREADCRUMBS_HEIGHT}px - ${INSET_LAYOUT_INDENT}px)`
        }}
      >
        {showBackButton && (
          <Link size="sm" prefixIcon to={backButtonTo?.() ?? ''} className="px-5 mt-7">
            {backButtonLabel}
          </Link>
        )}

        <ScrollArea className={cn('pb-11 !px-5 h-full', sidebarViewportClassName)}>
          {sidebarMenu.map((group, group_idx) => (
            <Fragment key={group.groupId}>
              {group_idx > 0 && <Separator />}
              <Layout.Grid className="w-full px-0 pb-2.5" gapY="4xs">
                {group?.title && (
                  <Text className="my-[4px] px-2.5" color="foreground-3">
                    {group?.title}
                  </Text>
                )}

                {group.items.map(item => (
                  <NavLink key={item.id} to={item.to}>
                    {({ isActive }) => (
                      <Text
                        truncate
                        variant="body-strong"
                        color={isActive ? 'foreground-1' : 'foreground-2'}
                        className={cn(
                          'hover:bg-cn-background-hover hover:text-cn-foreground-1 z-10 w-full rounded-md px-3 py-2 duration-0 ease-in-out bg-transparent transition-colors select-none',
                          { 'bg-cn-background-hover': isActive }
                        )}
                      >
                        {item.title}
                      </Text>
                    )}
                  </NavLink>
                ))}
              </Layout.Grid>
            </Fragment>
          ))}
        </ScrollArea>
      </div>
      <div className="flex h-full flex-1 [&:has(>:first-child.peer)]:self-center [&>*]:flex-1">{children}</div>
    </div>
  )
}
