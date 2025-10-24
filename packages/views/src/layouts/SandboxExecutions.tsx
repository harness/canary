import { FC } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs } from '@harnessio/ui/components'

import { SandboxLayout } from '..'
import { ExecutionsTopBar } from '../components/layout/executions-top-bar'

const SandboxExecutions: FC = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'summary'

  return (
    <>
      <SandboxLayout.Header>
        <ExecutionsTopBar />
      </SandboxLayout.Header>
      <SandboxLayout.SubHeader>
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={`summary`}>
              <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
            </NavLink>
            <NavLink to={`logs`}>
              <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
            </NavLink>
            <NavLink to={`inputs`}>
              <Tabs.Trigger value="inputs">Inputs</Tabs.Trigger>
            </NavLink>
            <NavLink to={`policy-evaluations`}>
              <Tabs.Trigger value="policy-evaluations">Policy evaluations</Tabs.Trigger>
            </NavLink>
            <NavLink to={`artifacts`}>
              <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
            </NavLink>
            <NavLink to={`tests`}>
              <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
            </NavLink>
            <NavLink to={`security-tests`}>
              <Tabs.Trigger value="security-tests">Security tests</Tabs.Trigger>
            </NavLink>
            <NavLink to={`secrets`}>
              <Tabs.Trigger value="secrets">Secrets</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SandboxExecutions }
