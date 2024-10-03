import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@harnessio/canary'
import { SandboxLayout } from '..'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

function SandboxSettingsAccountPage() {
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
              <TabsTrigger value="keys">Keys and tokens</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SandboxSettingsAccountPage }
