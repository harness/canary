// RepoLayout.tsx
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { PullRequestHeader } from '../components/pull-request/pull-request-conversation-header'

const mockedPullRequest = {
  number: 1,
  created: 1715284979958,
  edited: 1715284979958,
  state: 'open',
  is_draft: false,
  title: '[framework-fixtures]: bump the core group - pr 1',
  description: '',
  source_repo_id: 3,
  source_branch: 'source_branch0',
  source_sha: 'c0879587b546fcbded6e39432249003f6c8742c0',
  target_repo_id: 3,
  target_branch: 'main',
  merged: null,
  merge_method: null,
  merge_check_status: 'mergeable',
  merge_target_sha: '7d8c356eac25a94501653b57a44120104b8e9bc6',
  merge_base_sha: '7d8c356eac25a94501653b57a44120104b8e9bc6',
  author: {
    id: 3,
    uid: 'admin',
    display_name: 'Administrator',
    email: 'admin@gitness.io',
    type: 'user',
    created: 1699863416002,
    updated: 1699863416002
  },
  merger: null,
  stats: { commits: 1, files_changed: 1, additions: 1, deletions: 0, conversations: 1, unresolved_count: 1 }
}

const PullRequestLayout: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>()
  const { prId } = useParams<{ prId: string }>()

  return (
    <div className="px-8 pb-8 max-w-[1200px] mx-auto">
      <PullRequestHeader data={mockedPullRequest} />

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
