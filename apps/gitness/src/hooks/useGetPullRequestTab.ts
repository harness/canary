import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import { prRoutes, PullRequestRoutePathParams } from '../RouteDefinitions'

export enum PullRequestTab {
  CONVERSATION = 'conversation',
  COMMITS = 'commits',
  CHANGES = 'changes',
  CHECKS = 'checks'
}

interface RouteTabMapping {
  match: ReturnType<typeof useMatch>
  tab: PullRequestTab
}

const useGetPullRequestTab = ({
  spaceId,
  repoId,
  pullRequestId
}: PullRequestRoutePathParams): PullRequestTab | null => {
  const [pullRequestTab, setPullRequestTab] = useState<PullRequestTab | null>(null)

  const urlMatchArgs: PullRequestRoutePathParams = {
    spaceId: spaceId || '',
    repoId: repoId || '',
    pullRequestId: pullRequestId || ''
  }

  const routeTabMapping: RouteTabMapping[] = [
    {
      match: useMatch(prRoutes.toPullRequest(urlMatchArgs)),
      tab: PullRequestTab.CONVERSATION
    },
    {
      match: useMatch(prRoutes.toPullRequestConversation(urlMatchArgs)),
      tab: PullRequestTab.CONVERSATION
    },
    { match: useMatch(prRoutes.toPullRequestCommits(urlMatchArgs)), tab: PullRequestTab.COMMITS },
    { match: useMatch(prRoutes.toPullRequestChanges(urlMatchArgs)), tab: PullRequestTab.CHANGES },
    { match: useMatch(prRoutes.toPullRequestChecks(urlMatchArgs)), tab: PullRequestTab.CHECKS }
  ]

  useEffect(() => {
    const matchedRoute = routeTabMapping.find(route => route.match)
    if (matchedRoute) {
      setPullRequestTab(matchedRoute.tab)
    }
  }, [routeTabMapping, spaceId, repoId, pullRequestId])

  return pullRequestTab
}

export default useGetPullRequestTab
