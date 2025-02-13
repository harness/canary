import { NavLink, useLocation } from 'react-router-dom'

import { Tabs } from '@/components'
import { SandboxLayout } from '@/views'

function ProjectSettingsPage() {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={`general`}>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
            </NavLink>
            <NavLink to={`members`}>
              <Tabs.Trigger value="members">Members</Tabs.Trigger>
            </NavLink>
            <NavLink to={`labels`}>
              <Tabs.Trigger value="labels">Labels</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
    </>
  )
}

export { ProjectSettingsPage }
