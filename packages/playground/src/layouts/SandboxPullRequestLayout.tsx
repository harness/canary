// RepoLayout.tsx

import { NavLink, Outlet } from 'react-router-dom'

import { Badge, Icon, Spacer, Tabs, TabsList, TabsTrigger } from '@harnessio/canary'

import { SandboxLayout } from '..'
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

const SandboxPullRequestLayout: React.FC = () => {
  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel hasSubHeader>
        <SandboxLayout.Content>
          <Spacer size={8} />
          <PullRequestHeader data={mockedPullRequest} />
          <Tabs variant="tabnav" defaultValue="conversation">
            <TabsList>
              <NavLink to={`conversation`}>
                <TabsTrigger value="conversation">
                  <Icon size={16} name="comments" />
                  Conversation
                  <Badge variant="outline" size="xs">
                    1
                  </Badge>
                </TabsTrigger>
              </NavLink>
              <NavLink to={`commits`}>
                <TabsTrigger value="commits">
                  <Icon size={16} name="tube-sign" />
                  Commits
                  <Badge variant="outline" size="xs">
                    2
                  </Badge>
                </TabsTrigger>
              </NavLink>
              <NavLink to={`changes`}>
                <TabsTrigger value="pull-requests">
                  <Icon size={14} name="changes" />
                  Changes
                  <Badge variant="outline" size="xs">
                    2
                  </Badge>
                </TabsTrigger>
              </NavLink>
              <NavLink to={`checks`}>
                <TabsTrigger value="checks">
                  <Icon size={14} name="checks" />
                  Checks
                  <Badge variant="outline" size="xs">
                    9
                  </Badge>
                </TabsTrigger>
              </NavLink>
            </TabsList>
          </Tabs>
          <Spacer size={8} />
          <Outlet />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export default SandboxPullRequestLayout
