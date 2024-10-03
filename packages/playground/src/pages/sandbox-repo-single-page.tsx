import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@harnessio/canary'
import { SandboxLayout } from '..'
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom'

function SandboxRepoSinglePage() {
  const { repoId } = useParams<{ repoId: string }>()
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'summary'

  return (
    <>
      <SandboxLayout.SubHeader>
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`summary`}>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </NavLink>
            <NavLink to={`code`}>
              <TabsTrigger value="code">Files</TabsTrigger>
            </NavLink>
            <NavLink to={`/repos/${repoId}/pipelines`}>
              <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            </NavLink>
            <NavLink to={`/repos/${repoId}/commits`}>
              <TabsTrigger value="commits">Commits</TabsTrigger>
            </NavLink>
            <NavLink to={`/repos/${repoId}/pull-requests`}>
              <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
            </NavLink>
            <NavLink to={`/repos/${repoId}/webhooks`}>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </NavLink>
            <NavLink to={`/repos/${repoId}/branches`}>
              <TabsTrigger value="branches">Branches</TabsTrigger>
            </NavLink>
            <NavLink to={`/sandbox/repos/${repoId}/settings`}>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export { SandboxRepoSinglePage }
