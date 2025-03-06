import { useRouterContext } from '@/context'

import { SandboxLayout } from '..'

const RepoLayout: React.FC = () => {
  const { NavLink, Outlet } = useRouterContext()
  const baseClasses = 'h-full text-center flex items-center'

  const getLinkClasses = (isActive: boolean) =>
    `${baseClasses} ${isActive ? 'text-primary border-b border-primary' : 'text-tertiary-background hover:text-primary'}`

  return (
    <>
      <SandboxLayout.SubHeader>
        <div className="inline-flex h-[44px] w-full items-center justify-start gap-6 border-b border-border-background px-8 text-muted-foreground">
          <NavLink to="summary" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Summary
          </NavLink>
          <NavLink to="code" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Files
          </NavLink>
          <NavLink to="pipelines" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Pipelines
          </NavLink>
          <NavLink to="commits" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Commits
          </NavLink>
          <NavLink to="pulls" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Pull Requests
          </NavLink>
          <NavLink to="webhooks" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Webhooks
          </NavLink>
          <NavLink to="branches" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Branches
          </NavLink>
          <NavLink to="settings" className={({ isActive }: { isActive: boolean }) => getLinkClasses(isActive)}>
            Settings
          </NavLink>
        </div>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}

export default RepoLayout
