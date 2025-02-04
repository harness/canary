import { NavLink } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout } from '@/views'
import useActiveTab from '@hooks/use-get-active-tab'

export const ExecutionTabs = () => {
  const activeTab = useActiveTab('summary')

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`summary`}>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </NavLink>
            <NavLink to={`logs`}>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </NavLink>
            <NavLink to={`inputs`}>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
            </NavLink>
            <NavLink to={`opa`}>
              <TabsTrigger value="opa">Policy evaluations</TabsTrigger>
            </NavLink>
            <NavLink to={`artifacts`}>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            </NavLink>
            <NavLink to={`tests`}>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </NavLink>
            <NavLink to={`sto`}>
              <TabsTrigger value="sto">Security tests</TabsTrigger>
            </NavLink>
            <NavLink to={`secrets`}>
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}
