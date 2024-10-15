import { Navbar, Icon, NavbarProjectChooser, NavbarUser, IconProps } from '@harnessio/canary'
import React, { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { MoreSubmenu } from '../components/more-submenu'
import { navbarSubmenuData } from '../data/mockNavbarSubmenuData'
import { TypesUser } from './types'

interface NavbarItem {
  id: number
  title: string
  iconName: IconProps['name']
  description: string
  to?: string
}

interface RootLayoutProps {
  currentUser: TypesUser | undefined
}

export const RootLayout: React.FC<RootLayoutProps> = ({ currentUser }) => {
  const location = useLocation()
  const hideNavbarPaths = ['/signin', '/signup']
  const showNavbar = !hideNavbarPaths.includes(location.pathname)
  const [showMore, setShowMore] = useState<boolean>(false)

  const primaryMenuItems = [
    {
      text: 'Repositories',
      icon: <Icon name="repositories" size={12} />,
      to: '/repos'
    },
    {
      text: 'Pipelines',
      icon: <Icon name="pipelines" size={12} />,
      to: '/pipelines'
    },
    {
      text: 'Executions',
      icon: <Icon name="cog-6" size={12} />,
      to: '/executions'
    },
    {
      text: 'Featured Flags',
      icon: <Icon name="featured-flags" size={12} />,
      to: '/feature-flags'
    }
  ]

  const initialPinnedMenuItems: NavbarItem[] = [
    {
      id: 4,
      title: 'Chaos Engineering',
      iconName: 'chaos-engineering',
      description: 'Manage chaos experiments',
      to: '/chaos-engineering'
    },
    {
      id: 12,
      title: 'Environment',
      iconName: 'environment',
      description: 'Manage your environments',
      to: '/environment'
    },
    {
      id: 13,
      title: 'Secrets',
      iconName: 'secrets',
      description: 'Store your secrets securely',
      to: '/secrets'
    },
    {
      id: 14,
      title: 'Connectors',
      iconName: 'connectors',
      description: 'Manage your connectors',
      to: '/connectors'
    }
  ]

  const [pinnedItems, setPinnedItems] = useState<NavbarItem[]>(initialPinnedMenuItems)

  function handleMore() {
    setShowMore(!showMore)
  }

  function handlePinItem(item: NavbarItem) {
    setPinnedItems(prevPinnedItems => {
      const isPinned = prevPinnedItems.some(pinned => pinned.id === item.id)
      if (isPinned) {
        return prevPinnedItems.filter(pinned => pinned.id !== item.id)
      } else {
        const itemToPin = navbarSubmenuData.flatMap(group => group.items).find(i => i.id === item.id)
        if (itemToPin) {
          return [
            {
              id: itemToPin.id,
              title: itemToPin.title,
              iconName: itemToPin.iconName,
              description: itemToPin.description,
              to: itemToPin.to || ''
            },
            ...prevPinnedItems
          ]
        }
        return prevPinnedItems
      }
    })
  }

  return (
    <>
      <div className="bg-background grid md:grid-cols-[220px_minmax(900px,_1fr)] min-w-screen">
        {showNavbar && (
          <Navbar.Root className="max-md:hidden fixed top-0 left-0 bottom-0 z-50">
            <Navbar.Header>
              <NavbarProjectChooser.Root
                avatarLink={
                  <Link to="/">
                    <Icon name="harness" size={20} className="text-primary" />
                  </Link>
                }
              />
            </Navbar.Header>
            <Navbar.Content>
              <Navbar.Group>
                {primaryMenuItems.map((item, idx) => (
                  <NavLink key={idx} to={item.to || ''}>
                    {({ isActive }) => <Navbar.Item key={idx} text={item.text} icon={item.icon} active={isActive} />}
                  </NavLink>
                ))}
                <div onClick={() => (!showMore ? handleMore() : null)}>
                  <Navbar.Item text="More" icon={<Icon name="ellipsis" size={12} />} />
                </div>
              </Navbar.Group>
              <Navbar.AccordionGroup title="Pinned">
                {pinnedItems.map(item => (
                  <NavLink key={item.id} to={item.to || ''}>
                    {({ isActive }) => (
                      <Navbar.Item
                        key={item.id}
                        text={item.title}
                        icon={<Icon name={item.iconName} size={12} />}
                        active={isActive}
                      />
                    )}
                  </NavLink>
                ))}
              </Navbar.AccordionGroup>
              {/* Sandboxed new layout examples */}
              <Navbar.AccordionGroup title="Layout Sandbox">
                <NavLink to="/sandbox/landing">
                  <Navbar.Item text="Landing" icon={<Icon name="harness" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/repos">
                  <Navbar.Item text="Repo List" icon={<Icon name="repositories" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/repos/drone/summary">
                  <Navbar.Item
                    text="Repo&nbsp;&nbsp;/&nbsp;&nbsp;Summary"
                    icon={<Icon name="repositories" size={12} />}
                  />
                </NavLink>
                <NavLink to="/sandbox/repos/drone/code">
                  <Navbar.Item text="Repo&nbsp;&nbsp;/&nbsp;&nbsp;Code" icon={<Icon name="repositories" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/executions">
                  <Navbar.Item text="Executions" icon={<Icon name="cog-6" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/repos/create">
                  <Navbar.Item text="Create repository" icon={<Icon name="repositories" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/settings/account">
                  <Navbar.Item text="Account settings" icon={<Icon name="cog-6" size={12} />} />
                </NavLink>
                <NavLink to="/sandbox/settings/project">
                  <Navbar.Item text="Project settings" icon={<Icon name="cog-6" size={12} />} />
                </NavLink>
              </Navbar.AccordionGroup>
            </Navbar.Content>
            <Navbar.Footer>
              <NavLink to="/sandbox/settings/profile/general" className="p-2 hover:bg-tertiary">
                <NavbarUser.Root
                  username={currentUser ? currentUser.display_name : 'Steven M.'}
                  isAdmin={currentUser ? currentUser.admin : false}
                  url={currentUser ? undefined : '../images/user-avatar.svg'}
                />{' '}
              </NavLink>
            </Navbar.Footer>
          </Navbar.Root>
        )}
        <main className="col-start-2 min-h-screen box-border overflow-y-scroll overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MoreSubmenu showMore={showMore} handleMore={handleMore} onPinItem={handlePinItem} pinnedItems={pinnedItems} />
    </>
  )
}
