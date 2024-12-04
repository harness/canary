import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@harnessio/canary'

import { SandboxLayout } from '..'

function SettingsAccountPage() {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <SandboxLayout.SubHeader>
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`general`}>
              <TabsTrigger value="general">General</TabsTrigger>
            </NavLink>
            <NavLink to={`keys`}>
              <TabsTrigger value="keys">Keys and Tokens</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SettingsAccountPage }
