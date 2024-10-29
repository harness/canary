import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { Badge, Icon, Spacer } from '@harnessio/canary'
import { Floating1ColumnLayout, PullRequestHeader } from '@harnessio/playground'
import { TypesPullReq, useGetPullReqQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { PathParams } from '../RouteDefinitions'

const PullRequestLayout: React.FC = () => {
  const [pullRequest, setPullRequest] = useState<TypesPullReq>()
  const { spaceId, repoId, pullRequestId } = useParams<PathParams>()
  const repoRef = useGetRepoRef()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const { data: { body: pullRequestData } = {}, isFetching } = useGetPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  useEffect(() => {
    if (!isFetching && pullRequestData) {
      setPullRequest(pullRequestData)
    }
  }, [pullRequestData, isFetching])

  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 items-center gap-2 bg-background font-normal text-sm ease-in-out duration-150 hover:text-primary h-[36px] rounded-tl-md rounded-tr-md m-0 '
  // data-[state=active]:text-primary [&svg]:data-[state=active]:text-primary tabnav-inactive data-[state=active]:tabnav-active
  const getLinkClasses = (isActive: boolean) => {
    console.log(isActive)
    return `${baseClasses} ${isActive ? 'text-primary [&svg]:text-primary tabnav-active' : 'tabnav-inactive'}`
  }
  return (
    <>
      <Floating1ColumnLayout>
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
              state: pullRequest?.state
            }}
          />
        )}
        <div className="relative w-full grid grid-flow-col grid-cols-[auto_1fr] items-end">
          <div className="inline-flex items-center text-muted-foreground h-[36px] gap-0 justify-start w-full">
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
          <div className="absolute right-full w-[9999px] h-[36px] border-b border-border-background" />
          <div className="absolute left-full w-[9999px] h-[36px] border-b border-border-background" />
        </div>
        <Spacer size={8} />
        <Outlet />
      </Floating1ColumnLayout>
    </>
  )
}

export default PullRequestLayout
