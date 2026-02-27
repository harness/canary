import { SidebarProvider, useSidebar, UseSidebarSignature } from './sidebar-context'
import { SidebarItem, SidebarItemProps, SidebarMenuSubItem } from './sidebar-item'
import { SidebarToggleMenuButton } from './sidebar-toggle-menu-button'
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarRoot,
  SidebarSeparator,
  SidebarTrigger
} from './sidebar-units'

const Sidebar = {
  Root: SidebarRoot,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Header: SidebarHeader,
  Inset: SidebarInset,
  Item: SidebarItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  ToggleMenuButton: SidebarToggleMenuButton
}

export { Sidebar, useSidebar, type SidebarItemProps, type UseSidebarSignature }
export { DraggableSidebarDivider, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './draggable-sidebar-divider'
