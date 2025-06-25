import { NavbarItemType, Sidebar } from '@/components'
import { useTranslation } from '@/context'
import { wrapConditionalArrayElements } from '@utils/mergeUtils'

interface NavbarItemProps {
  item: NavbarItemType
  isRecent?: boolean
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  handleCustomNav: () => void
  disabled?: boolean
}

export const AppSidebarItem = ({
  item,
  isRecent = false,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  handleCustomNav,
  disabled = false
}: NavbarItemProps) => {
  const { t } = useTranslation()

  const handlePin = () => {
    handleChangePinnedMenuItem(item, isRecent)
  }

  const handleRemoveRecent = () => {
    handleRemoveRecentMenuItem(item)
  }

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
      title={item.title}
      to={item.to || ''}
      icon={item.iconName}
      actionMenuItems={actionMenuItems}
      end
      disabled={disabled}
    />
  )
}
