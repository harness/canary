import React from 'react'
import { noop } from 'lodash-es'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { mockProjects } from '../data/mockProjects'
import { SandboxLayout } from '..'
import { ExecutionsTopBar } from '../components/layout/executions-top-bar'
import { Tabs, TabsList, TabsTrigger } from '@harnessio/canary'

const SandboxExecutions: React.FC = () => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'summary'
  return (
    <>
      <SandboxLayout.Header>
        <ExecutionsTopBar projects={mockProjects} onSelectProject={noop} />
      </SandboxLayout.Header>
      <SandboxLayout.SubHeader>
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
            <NavLink to={`policy-evaluations`}>
              <TabsTrigger value="policy-evaluations">Policy evaluations</TabsTrigger>
            </NavLink>
            <NavLink to={`artifacts`}>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            </NavLink>
            <NavLink to={`tests`}>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </NavLink>
            <NavLink to={`security-tests`}>
              <TabsTrigger value="security-tests">Security tests</TabsTrigger>
            </NavLink>
            <NavLink to={`secrets`}>
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SandboxExecutions }
