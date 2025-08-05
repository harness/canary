import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useRepoRuleGetQuery } from '@harnessio/code-service-client'
import { Skeleton } from '@harnessio/ui/components'
import { NotFoundPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { useRepoRulesStore } from '../stores/repo-settings-store'
import { RepoBranchRulesContainer } from './repo-branch-rules-container'
import { RepoTagRulesContainer } from './repo-tag-rules-container'

export enum RuleType {
  BRANCH = 'branch',
  TAG = 'tag'
}

export const RepoRulesContainer = () => {
  const repoRef = useGetRepoRef()
  const { identifier } = useParams()
  const { setPresetRuleData } = useRepoRulesStore()

  const {
    data: { body: rulesData } = {},
    error: fetchRuleError,
    isLoading: fetchRuleIsLoading
  } = useRepoRuleGetQuery(
    { repo_ref: repoRef, rule_identifier: identifier ?? '' },
    {
      enabled: !!identifier
    }
  )

  useEffect(() => {
    if (rulesData) {
      // Set the rule type based on the API response
      setPresetRuleData(rulesData)
    }
  }, [rulesData, setPresetRuleData])

  // Show loading state while fetching rule data
  if (fetchRuleIsLoading) {
    return <Skeleton.Form className="mt-7" />
  }

  // Show error page if rule not found
  if (fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
  }

  // Render the appropriate container based on rule type
  switch (rulesData?.type) {
    case RuleType.TAG:
      return <RepoTagRulesContainer />
    case RuleType.BRANCH:
    default:
      return <RepoBranchRulesContainer />
  }
}

export default RepoRulesContainer
