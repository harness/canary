// RepoLayout.tsx

import { NavLink, Outlet, useParams } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Tabs,
  TabsList,
  TabsTrigger,
  Topbar
} from '@harnessio/canary'

const RepoExecutionLayout: React.FC = () => {
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
      <Tabs variant="navigation" defaultValue="index">
        <TabsList>
          <NavLink to={`/repos/${repoId}`}>
            <TabsTrigger value="index">Foo</TabsTrigger>
          </NavLink>
          <NavLink to={`pipelines`}>
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          </NavLink>
          <NavLink to={`commits`}>
            <TabsTrigger value="commits">Commits</TabsTrigger>
          </NavLink>
          <NavLink to={`pull-requests`}>
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          </NavLink>
          <NavLink to={`branches`}>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </NavLink>
        </TabsList>
      </Tabs>
      {/* 100vh = screen height - (55px Breadcrumbs Height + 45px SubHeader Height = 100px) */}
      {/* Total height of both the divs should be 100vh */}
      <main className="box-border min-h-[calc(100vh-100px)] overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default RepoExecutionLayout
