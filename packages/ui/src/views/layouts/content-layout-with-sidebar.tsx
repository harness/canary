import { FC, ReactNode } from 'react'

import { NavbarSkeleton, ScrollArea } from '@/components'
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
}

export const ContentLayoutWithSidebar: FC<ContentLayoutWithSidebarProps> = ({
  children,
  sidebarMenu,
  sidebarOffsetTop = 0,
  sidebarViewportClassName
}) => {
  const { NavLink } = useRouterContext()

  return (
    <div className="relative mx-auto flex w-full items-start gap-x-20 pr-4">
      <div
        className="sticky w-[220px]"
        style={{
          top: `${sidebarOffsetTop}px`,
          height: `calc(100svh - ${sidebarOffsetTop + BREADCRUMBS_HEIGHT}px - ${INSET_LAYOUT_INDENT}px)`
        }}
      >
        <ScrollArea className={cn('pb-11 !px-4 h-full', sidebarViewportClassName)}>
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
