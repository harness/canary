// RepoLayout.tsx
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

const PullRequestLayout: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>()
  const { prId } = useParams<{ prId: string }>()

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <NavLink
          to={`/repos/${repoId}/pull-requests/${prId}`}
          style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}
          end>
          Index
        </NavLink>
        <NavLink to={`conversation`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
          Conversation
        </NavLink>
        <NavLink to={`changes`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
          Changes
        </NavLink>
        <NavLink to={`checks`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
          Checks
        </NavLink>
        <NavLink to={`commits`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
          Commits
        </NavLink>
      </div>
      <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Outlet />
    </div>
  )
}

export default PullRequestLayout
