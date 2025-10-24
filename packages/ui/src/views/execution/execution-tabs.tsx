import { NavLink } from 'react-router-dom'

import { Tabs } from '@/components'
import { SandboxLayout } from '@/views'
import useActiveTab from '@hooks/use-get-active-tab'

export const ExecutionTabs = () => {
  const activeTab = useActiveTab('summary')

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px]">
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={'summary'}>
              <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
            </NavLink>
            <NavLink to={'logs'}>
              <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
            </NavLink>
            <NavLink to={'graph'}>
              <Tabs.Trigger value="graph">Graph</Tabs.Trigger>
            </NavLink>
            <NavLink to={'inputs'}>
              <Tabs.Trigger value="inputs">Inputs</Tabs.Trigger>
            </NavLink>
            <NavLink to={'opa'}>
              <Tabs.Trigger value="opa">Policy evaluations</Tabs.Trigger>
            </NavLink>
            <NavLink to={'artifacts'}>
              <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
            </NavLink>
            <NavLink to={'tests'}>
              <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
            </NavLink>
            <NavLink to={'sto'}>
              <Tabs.Trigger value="sto">Security tests</Tabs.Trigger>
            </NavLink>
            <NavLink to={'secrets'}>
              <Tabs.Trigger value="secrets">Secrets</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
    </>
  )
}
