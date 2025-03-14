import { useSpaceRuleListQuery } from '@harnessio/code-service-client'
import { ProjectRulesPage } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectRulesListContainer = () => {
  const space_ref = useGetSpaceURLParam()
  const { data: { body: rulesData } = {}, isLoading } = useSpaceRuleListQuery({
    space_ref: space_ref ?? '',
    queryParams: {}
  })

  return <ProjectRulesPage rulesData={rulesData} isLoading={isLoading} useTranslationStore={useTranslationStore} />
}
