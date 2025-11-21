import { SidebarProvider, useSidebar, UseSidebarSignature } from './sidebar-context'
import { SidebarItem, SidebarItemProps, SidebarMenuSubItem } from './sidebar-item'
import { SidebarRail } from './sidebar-rail'
import { SidebarToggleMenuButton } from './sidebar-toggle-menu-button'
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuSkeleton,
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
