import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Header from '../components/Header'

const RepoLayout: React.FC = () => {
  const baseClasses = 'h-full text-center flex items-center'

  const getLinkClasses = (isActive: boolean) =>
    `${baseClasses} ${isActive ? 'text-primary border-b border-primary' : 'text-tertiary-background hover:text-primary'}`

  return (
    <div>
      <Header />
      <div className="inline-flex items-center text-muted-foreground h-[44px] border-b border-border-background gap-6 justify-start w-full px-8">
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
      <main className="min-h-[calc(100vh-100px)] box-border overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default RepoLayout
