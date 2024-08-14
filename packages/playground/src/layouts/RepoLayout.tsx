// RepoLayout.tsx
import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'

const RepoLayout: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>()

  return (
    <div>
      <header style={{ background: '#333', padding: '20px', height: '56px' }}>
        <h1>Repository {repoId}</h1>
      </header>
      <header style={{ background: '#222', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink to={`/repos/${repoId}`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })} end>
            Index
          </NavLink>
          <NavLink to="pipelines" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
            Pipelines
          </NavLink>
          <NavLink to="commits" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
            Commits
          </NavLink>
          <NavLink to="pull-requests" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
            Pull requests
          </NavLink>
          <NavLink to="branches" style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
            Branches
          </NavLink>
        </div>
      </header>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default RepoLayout
