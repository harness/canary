import { NavLink } from 'react-router-dom'

import { NavbarSkeleton } from '@components/navbar-skeleton'
import { MenuGroupType } from '@components/navbar/types'

interface RepoSidebarProps {
  items: MenuGroupType[]
}

export function RepoSidebar({ items }: RepoSidebarProps) {
  return (
    <>
      {items.map((group, group_idx) => (
        <NavbarSkeleton.Group
          key={group.groupId}
          topBorder={group_idx > 0}
          title={group.title}
          isSubMenu
          className="gap-0.5 px-0"
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
    </>
  )
}
