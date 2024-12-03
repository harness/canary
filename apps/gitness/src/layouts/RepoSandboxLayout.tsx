import { NavLink, Outlet } from 'react-router-dom'

import { SandboxLayout } from '@harnessio/views'

const RepoSandboxLayout: React.FC = () => {
  const baseClasses = 'h-full text-center flex items-center'

  const getLinkClasses = (isActive: boolean) =>
    `${baseClasses} ${isActive ? 'text-primary border-b border-primary' : 'text-tertiary-background hover:text-primary'}`

  return (
    <>
      <SandboxLayout.SubHeader>
        <div className="inline-flex h-[44px] w-full items-center justify-start gap-6 border-b border-border-background px-8 text-muted-foreground">
          <NavLink to="summary" className={({ isActive }) => getLinkClasses(isActive)}>
            Summary
          </NavLink>
          <NavLink to="code" className={({ isActive }) => getLinkClasses(isActive)}>
            Files
          </NavLink>
          <NavLink to="pipelines" className={({ isActive }) => getLinkClasses(isActive)}>
            Pipelines
          </NavLink>
          <NavLink to="commits" className={({ isActive }) => getLinkClasses(isActive)}>
            Commits
          </NavLink>
          <NavLink to="pull-requests" className={({ isActive }) => getLinkClasses(isActive)}>
            Pull Requests
          </NavLink>
          <NavLink to="webhooks" className={({ isActive }) => getLinkClasses(isActive)}>
            Webhooks
          </NavLink>
          <NavLink to="branches" className={({ isActive }) => getLinkClasses(isActive)}>
            Branches
          </NavLink>
          <NavLink to="settings" className={({ isActive }) => getLinkClasses(isActive)}>
            Settings
          </NavLink>
        </div>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export default RepoSandboxLayout
