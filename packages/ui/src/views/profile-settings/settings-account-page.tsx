import { NavLink, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout } from '@/views'

function SettingsAccountPage() {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
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
    </>
  )
}

export { SettingsAccountPage }
