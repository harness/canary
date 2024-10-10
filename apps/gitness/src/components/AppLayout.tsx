import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { Icon, Navbar, NavbarProjectChooser, NavbarUser } from '@harnessio/canary'
import { RootLayout as _RootLayout } from '@harnessio/playground'
import { PathParams } from '../RouteDefinitions'
import { useAppContext } from '../framework/context/AppContext'

interface MenuItem {
  text: string
  icon: React.JSX.Element
  to: string
}

export const AppLayout: React.FC = () => {
  const { currentUser } = useAppContext()
  const { spaceId } = useParams<PathParams>()

  const PrimaryMenuItems: MenuItem[] = [
    {
      text: 'Repositories',
      icon: <Icon name="repositories" size={12} />,
      to: `${spaceId}/repos`
    }
  ]

  return (
    <>
      <div className="bg-background grid md:grid-cols-[220px_minmax(900px,_1fr)] min-w-screen">
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
              {PrimaryMenuItems.map((item, idx) => (
                <NavLink key={idx} to={item.to || ''}>
                  {({ isActive }) => <Navbar.Item key={idx} text={item.text} icon={item.icon} active={isActive} />}
                </NavLink>
              ))}
            </Navbar.Group>
          </Navbar.Content>
          <Navbar.Footer>
            <NavLink to="/sandbox/settings/profile/general" className="p-2 hover:bg-tertiary">
              <NavbarUser.Root username={currentUser?.display_name} isAdmin={currentUser?.admin} />
            </NavLink>
          </Navbar.Footer>
        </Navbar.Root>
        <main className="col-start-2 min-h-screen box-border overflow-y-scroll overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </>
  )
}
