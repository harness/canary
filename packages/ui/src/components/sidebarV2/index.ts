import { SidebarV2Content } from './sidebar-content'
import { SidebarV2Provider } from './sidebar-context'
import { SidebarV2Group } from './sidebar-group'
import { SidebarItemV2 } from './sidebar-item'
import { SidebarV2Root } from './sidebar-root'
import { SidebarV2Separator } from './sidebar-separator'

// Type exports
export type * from './types'

/**
 * SidebarV2 - Modern Sidebar Component System
 *
 * Based on Harness Design System 3.0 BETA
 * Figma: https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/Harness-Design-System--3.0--BETA?node-id=2060-26364
 *
 * Usage:
 * ```tsx
 * <SidebarV2.Provider defaultCollapsed={false}>
 *   <SidebarV2.Root>
 *     <SidebarV2.Content>
 *       <SidebarV2.Item to="/home" iconName="home" content="Home" />
 *
 *       <SidebarV2.Item
 *         to="/settings"
 *         selected
 *         iconName="settings"
 *         content="Settings"
 *         suffix={<Button size="xs" variant="ghost" iconOnly><IconV2 name="more-vert" /></Button>}
 *       />
 *
 *       <SidebarV2.Separator />
 *
 *       <SidebarV2.Item onClick={handleClick} iconName="github" content="GitHub" />
 *     </SidebarV2.Content>
 *   </SidebarV2.Root>
 * </SidebarV2.Provider>
 * ```
 *
 * SidebarV2.Item Props:
 * - `iconName` - Icon name to render as the leading element
 * - `content` - ReactNode to display as the label
 * - `suffix` - ReactNode for trailing elements (actions, badges, etc.)
 */

export const SidebarV2 = {
  Provider: SidebarV2Provider,
  Root: SidebarV2Root,
  Content: SidebarV2Content,
  Group: SidebarV2Group,
  Separator: SidebarV2Separator,
  Item: SidebarItemV2
}
