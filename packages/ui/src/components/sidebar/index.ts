import { SidebarProvider, useSidebar, UseSidebarSignature } from './sidebar-context'
import { SidebarItem, SidebarItemProps, SidebarMenuSubItem } from './sidebar-item'
import { SidebarItemV2, SidebarItemV2Props, SidebarMenuSubItemV2 } from './sidebar-item-v2'
import { SidebarPopover } from './sidebar-popover'
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
  ItemV2: SidebarItemV2,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubItemV2: SidebarMenuSubItemV2,
  Popover: SidebarPopover,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  ToggleMenuButton: SidebarToggleMenuButton
}

export { Sidebar, useSidebar, type SidebarItemProps, type SidebarItemV2Props, type UseSidebarSignature }
export { DraggableSidebarDivider, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './draggable-sidebar-divider'
