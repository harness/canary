// RepoLayout.tsx

import { FC } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Topbar
} from '@harnessio/canary'
import { Tabs } from '@harnessio/ui/components'

const RepoExecutionLayout: FC = () => {
  const { repoId } = useParams<{ repoId: string }>()

  return (
    <div>
      <Topbar.Root>
        <Topbar.Left>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium text-primary" href="/">
                  {repoId}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="font-thin">&nbsp;/&nbsp;</BreadcrumbSeparator>
              <BreadcrumbPage>
                <BreadcrumbLink href="/components">pipeline.yml</BreadcrumbLink>
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </Topbar.Left>
        <Topbar.Right>
          <></>
        </Topbar.Right>
      </Topbar.Root>
      <Tabs.Root variant="navigation" defaultValue="index">
        <Tabs.List>
          <NavLink to={`/repos/${repoId}`}>
            <Tabs.Trigger value="index">Foo</Tabs.Trigger>
          </NavLink>
          <NavLink to={`pipelines`}>
            <Tabs.Trigger value="pipelines">Pipelines</Tabs.Trigger>
          </NavLink>
          <NavLink to={`commits`}>
            <Tabs.Trigger value="commits">Commits</Tabs.Trigger>
          </NavLink>
          <NavLink to={`pull-requests`}>
            <Tabs.Trigger value="pull-requests">Pull Requests</Tabs.Trigger>
          </NavLink>
          <NavLink to={`branches`}>
            <Tabs.Trigger value="branches">Branches</Tabs.Trigger>
          </NavLink>
        </Tabs.List>
      </Tabs.Root>
      <main className="box-border min-h-[calc(100vh-100px)] overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default RepoExecutionLayout
