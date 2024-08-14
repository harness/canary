// RepoLayout.tsx
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

const PipelineLayout: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>()
  const { pipelineId } = useParams<{ pipelineId: string }>()

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <NavLink
          to={`/repos/${repoId}/pipelines/${pipelineId}`}
          style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}
          end>
          Index
        </NavLink>
        <NavLink to={`edit`} style={({ isActive }) => ({ color: isActive ? 'green' : 'inherit' })}>
          Edit
        </NavLink>
      </div>
      <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
      <Outlet />
    </div>
  )
}

export default PipelineLayout
