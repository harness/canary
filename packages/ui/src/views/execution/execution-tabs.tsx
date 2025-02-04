import { NavLink, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout } from '@/views'

export const ExecutionTabs = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'summary'

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`summary`}>
              <TabsTrigger value="general">Summary</TabsTrigger>
            </NavLink>
            <NavLink to={`logs`}>
              <TabsTrigger value="members">Logs</TabsTrigger>
            </NavLink>
            <NavLink to={`inputs`}>
              <TabsTrigger value="labels">Inputs</TabsTrigger>
            </NavLink>
            <NavLink to={`opa`}>
              <TabsTrigger value="labels">Policy evaluations</TabsTrigger>
            </NavLink>
            <NavLink to={`artifacts`}>
              <TabsTrigger value="labels">Artifacts</TabsTrigger>
            </NavLink>
            <NavLink to={`tests`}>
              <TabsTrigger value="labels">Tests</TabsTrigger>
            </NavLink>
            <NavLink to={`sto`}>
              <TabsTrigger value="labels">Security tests</TabsTrigger>
            </NavLink>
            <NavLink to={`secrets`}>
              <TabsTrigger value="labels">Secrets</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}
