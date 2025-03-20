import { FC, ReactNode } from 'react'

import { NavbarSkeleton, ScrollArea } from '@/components'
import { INSET_THEME_PADDING, useRouterContext, useTheme } from '@/context'
import { cn } from '@utils/cn'

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
}

export const ContentLayoutWithSidebar: FC<ContentLayoutWithSidebarProps> = ({
  children,
  sidebarMenu,
  sidebarOffsetTop = 0,
  sidebarViewportClassName
}) => {
  const { NavLink } = useRouterContext()
  const { isInset } = useTheme()

  return (
    <div className="relative mx-auto flex w-full max-w-[1088px] items-start gap-x-20 pr-4">
      <div
        className="sticky w-[220px]"
        style={{
          top: `${sidebarOffsetTop}px`,
          height: `calc(100svh - ${isInset ? sidebarOffsetTop + INSET_THEME_PADDING * 2 : sidebarOffsetTop}px)`
        }}
      >
        <ScrollArea className="h-full" viewportClassName={cn('pb-11 !px-4', sidebarViewportClassName)}>
          {sidebarMenu.map((group, group_idx) => (
            <NavbarSkeleton.Group
              className="gap-1 px-0"
              titleClassName="my-[5px]"
              key={group.groupId}
              topBorder={group_idx > 0}
              title={group?.title}
              isSubMenu
            >
              {group.items.map(item => (
                <NavLink key={item.id} to={item.to}>
                  {({ isActive }) => (
                    <NavbarSkeleton.Item
                      className="py-2"
                      text={item.title}
                      description={item?.description}
                      submenuItem
                      active={isActive}
                    />
                  )}
                </NavLink>
              ))}
            </NavbarSkeleton.Group>
          ))}
        </ScrollArea>
      </div>
      <div className="flex flex-1 [&:has(>:first-child.peer)]:self-center [&>*]:flex-1">{children}</div>
    </div>
  )
}
