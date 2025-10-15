import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { OpenapiRule, useSpaceRuleGetQuery } from '@harnessio/code-service-client'
import { Skeleton } from '@harnessio/ui/components'
import { NotFoundPage } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { transformDataFromApi } from '../../../utils/repo-branch-rules-utils'
import { useProjectRulesStore } from '../stores/project-rules-store'
import { ProjectBranchRulesContainer } from './project-branch-rules-container'
import { ProjectTagRulesContainer } from './project-tag-rules-container'

export enum RuleType {
  BRANCH = 'branch',
  TAG = 'tag'
}

export const ProjectRulesContainer = () => {
  const spaceRef = useGetSpaceURLParam()
  const { ruleId } = useParams()
  const { setPresetRuleData } = useProjectRulesStore()

  const {
    data: { body: rulesData } = {},
    error: fetchRuleError,
    isLoading: fetchRuleIsLoading
  } = useSpaceRuleGetQuery(
    { space_ref: `${spaceRef}/+` || '', rule_identifier: ruleId ?? '' },
    {
      enabled: !!ruleId && !!spaceRef
    }
  )

  useEffect(() => {
    if (rulesData) {
      // Transform the API response data to the expected format
      const transformedData = transformDataFromApi(rulesData as OpenapiRule)
      // Set the transformed data in the store
      setPresetRuleData(transformedData)
    }
  }, [rulesData, setPresetRuleData])

  // Show loading state while fetching rule data
  if (fetchRuleIsLoading) {
    return <Skeleton.Form className="w-full h-fit" linesCount={4} />
  }

  // Show error page if rule not found
  if (fetchRuleError) {
    return <NotFoundPage pageTypeText="rules" />
  }

  // Render the appropriate container based on rule type
  switch (rulesData?.type) {
    case RuleType.TAG:
      return <ProjectTagRulesContainer />
    case RuleType.BRANCH:
    default:
      return <ProjectBranchRulesContainer />
  }
}

export default ProjectRulesContainer
