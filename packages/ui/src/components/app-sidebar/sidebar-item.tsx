import { NavbarItemType, Sidebar, SidebarItemProps } from '@/components'
import { useTranslation } from '@/context'
import { wrapConditionalArrayElements } from '@utils/mergeUtils'

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
  disabled?: boolean
  actionButtons?: SidebarItemProps['actionButtons']
  hideMenuItems?: boolean
  active?: boolean
  draggable?: boolean
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: Record<string, Function | undefined>
}

export const AppSidebarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav,
  disabled = false,
  actionButtons,
  hideMenuItems = false,
  active = false,
  draggable,
  dragAttributes,
  dragListeners
}: NavbarItemProps) => {
  const { t } = useTranslation()

  const handlePin = () => handleChangePinnedMenuItem(item, isRecent)
  const handleRemoveRecent = () => handleRemoveRecentMenuItem(item)

  const actionMenuItems = isRecent
    ? [
        { title: t('component:navbar.pin', 'Pin'), onSelect: handlePin },
        { title: t('component:navbar.remove', 'Remove'), onSelect: handleRemoveRecent }
      ]
    : [
        { title: t('component:navbar.reorder', 'Reorder'), onSelect: handleCustomNav },
        ...wrapConditionalArrayElements(
          [{ title: t('component:navbar.unpin', 'Unpin'), onSelect: handlePin }],
          !item.permanentlyPinned
        )
      ]

  return (
    <Sidebar.Item
      end
      title={item.title}
      to={item.to || ''}
      icon={item.iconName}
      actionMenuItems={hideMenuItems ? undefined : actionMenuItems}
      disabled={disabled}
      actionButtons={actionButtons}
      active={active}
      draggable={draggable}
      dragAttributes={dragAttributes}
      dragListeners={dragListeners}
    />
  )
}
AppSidebarItem.displayName = 'AppSidebarItem'
