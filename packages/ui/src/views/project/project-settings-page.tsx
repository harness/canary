import { NavLink, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout } from '@/views'

function ProjectSettingsPage() {
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
            <NavLink to={`members`}>
              <TabsTrigger value="members">Members</TabsTrigger>
            </NavLink>
            <NavLink to={`labels`}>
              <TabsTrigger value="labels">Labels</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}

export { ProjectSettingsPage }
