import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs } from '@harnessio/ui/components'

import { SandboxLayout } from '..'

function SettingsAccountPage() {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <SandboxLayout.SubHeader>
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={`general`}>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
            </NavLink>
            <NavLink to={`keys`}>
              <Tabs.Trigger value="keys">Keys and Tokens</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SettingsAccountPage }
