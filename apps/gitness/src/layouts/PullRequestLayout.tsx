import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

import { Badge, Icon, Spacer } from '@harnessio/canary'
import { TypesPullReq, useGetPullReqQuery } from '@harnessio/code-service-client'
import { PullRequestHeader, SandboxLayout } from '@harnessio/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { PathParams } from '../RouteDefinitions'

const PullRequestLayout: React.FC = () => {
  const [pullRequest, setPullRequest] = useState<TypesPullReq>()
  const { pullRequestId, spaceId, repoId } = useParams<PathParams>()
  const repoRef = useGetRepoRef()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const { data: { body: pullRequestData } = {}, isFetching } = useGetPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  useEffect(() => {
    if (!isFetching && pullRequestData) {
      setPullRequest(pullRequestData)
    }
  }, [pullRequestData, isFetching])

  const baseClasses =
    'inline-flex items-center justify-center px-3 py-1 px-4 items-center gap-2 bg-background hover:text-primary h-[36px] rounded-tl-md rounded-tr-md m-0'
  const getLinkClasses = (isActive: boolean) => {
    return `${baseClasses} ${isActive ? 'text-primary [&svg]:text-primary tabnav-active' : 'tabnav-inactive'}`
  }
  return (
    <>
      <SandboxLayout.Main>
        <SandboxLayout.Content maxWidth="5xl">
          <Spacer size={8} />
          {pullRequest && (
            <PullRequestHeader
              data={{
                title: pullRequest?.title,
                number: pullRequest?.number,
                merged: pullRequest?.merged,
                author: pullRequest?.author,
                stats: { commits: pullRequest?.stats?.commits },
                target_branch: pullRequest?.target_branch,
                source_branch: pullRequest?.source_branch,
                created: pullRequest?.created,
                is_draft: pullRequest?.is_draft,
                state: pullRequest?.state,
                spaceId,
                repoId
              }}
            />
          )}
          <div className="relative grid w-full grid-flow-col grid-cols-[auto_1fr] items-end">
            <div className="inline-flex h-[36px] w-full items-center justify-start gap-0 text-muted-foreground">
              <NavLink to={`conversation`} className={({ isActive }) => getLinkClasses(isActive)}>
                <Icon size={16} name="comments" />
                Conversation
                <Badge variant="outline" size="xs">
                  1
                </Badge>
              </NavLink>
              <NavLink to={`commits`} className={({ isActive }) => getLinkClasses(isActive)}>
                <Icon size={16} name="tube-sign" />
                Commits
                <Badge variant="outline" size="xs">
                  {pullRequest?.stats?.commits}
                </Badge>
              </NavLink>
              <NavLink to={`changes`} className={({ isActive }) => getLinkClasses(isActive)}>
                <Icon size={14} name="changes" />
                Changes
                <Badge variant="outline" size="xs">
                  {pullRequest?.stats?.files_changed}
                </Badge>
              </NavLink>
            </div>
            <div className="h-[36px] border-b border-border-background" />
            <div className="absolute right-full h-[36px] w-0 border-b border-border-background" />
            <div className="absolute left-full h-[36px] w-0 border-b border-border-background" />
          </div>
          <Spacer size={8} />
          <Outlet />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { PullRequestLayout }
