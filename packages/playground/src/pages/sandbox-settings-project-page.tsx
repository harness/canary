import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@harnessio/canary'
import { SandboxLayout } from '..'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

function SandboxSettingsProjectPage() {
  const location = useLocation()
  const activeTab = location.pathname.includes('member') ? 'members' : 'general'

  return (
    <>
      <SandboxLayout.SubHeader>
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`general`}>
              <TabsTrigger value="general">General</TabsTrigger>
            </NavLink>
            <NavLink to={`members`}>
              <TabsTrigger value="members">Members</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SandboxSettingsProjectPage }
