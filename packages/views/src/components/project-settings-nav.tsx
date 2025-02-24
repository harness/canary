import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs } from '@harnessio/ui/components'

import { SandboxLayout } from '..'

function SettingsProjectNav() {
  const location = useLocation()
  const activeTab = location.pathname.includes('member') ? 'members' : 'general'

  return (
    <>
      <SandboxLayout.SubHeader>
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={`general`}>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
            </NavLink>
            <NavLink to={`members`}>
              <Tabs.Trigger value="members">Members</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SettingsProjectNav }
