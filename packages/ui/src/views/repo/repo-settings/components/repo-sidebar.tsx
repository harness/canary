import { NavLink } from 'react-router-dom'

import NavbarSkeleton from '@/components/navbar/navbar-skeleton'
import { MenuGroupType } from '@components/navbar/types'

interface RepoSidebarProps {
  showMoreMenu: boolean
  handleMoreMenu: () => void
  items: MenuGroupType[]
}

export function RepoSidebar({ showMoreMenu, handleMoreMenu, items }: RepoSidebarProps) {
  return (
    <div>
      {items.map((group, group_idx) => (
        <NavbarSkeleton.Group
          key={group.groupId}
          topBorder={group_idx > 0}
          title={group.title}
          isSubMenu
          className="px-0"
        >
          {group.items.map(item => (
            <NavLink key={item.id} to={item.to || ''}>
              {({ isActive }) => (
                <NavbarSkeleton.Item
                  text={item.title || ''}
                  description={item.description || ''}
                  submenuItem
                  active={isActive}
                />
              )}
            </NavLink>
          ))}
        </NavbarSkeleton.Group>
      ))}
    </div>
  )
}
