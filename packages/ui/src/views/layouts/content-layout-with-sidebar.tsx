import { FC, Fragment, ReactNode } from 'react'

import { Layout, Link, ScrollArea, Separator, Text } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

import { SandboxLayout } from './SandboxLayout'

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
  sidebarContainerClassName?: string
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
  showBackButton = false,
  backButtonLabel = 'Back',
  backButtonTo
}) => {
  const { NavLink } = useRouterContext()

  return (
    <SandboxLayout.Content className="gap-x-cn-4xl relative flex-row">
      <Layout.Grid
        className={cn('top-[var(--cn-breadcrumbs-height)] sticky w-[228px] h-fit -mt-7 pt-7 shrink-0')}
        gapY="lg"
      >
        {showBackButton && (
          <Link size="sm" prefixIcon to={backButtonTo?.() ?? ''}>
            {backButtonLabel}
          </Link>
        )}

        <ScrollArea className="h-full pb-11">
          {sidebarMenu.map((group, group_idx) => (
            <Fragment key={group.groupId}>
              {group_idx > 0 && <Separator className="mb-2" />}
              <Layout.Grid className="w-full px-0 pb-1.5" gapY="3xs">
                {group?.title && (
                  <Text className="mt-2 px-2.5" variant="caption-single-line-normal">
                    {group?.title}
                  </Text>
                )}

                {group.items.map(item => (
                  <NavLink key={item.id} to={item.to}>
                    {({ isActive }) => (
                      <Text
                        truncate
                        variant={isActive ? 'body-single-line-strong' : 'body-single-line-normal'}
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
      </Layout.Grid>

      {children}
    </SandboxLayout.Content>
  )
}
