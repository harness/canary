import { FC, useMemo } from 'react'

import { Checkbox, NoData, Pagination, Text } from '@/components'
import { useTranslation } from '@/context'
import { ErrorTypes, IProjectRulesStore, SandboxLayout } from '@/views'
import { RepoSettingsGeneralRules } from '@views/repo/repo-settings/components/repo-settings-general-rules'

export interface ProjectRulesPageProps {
  useProjectRulesStore: () => IProjectRulesStore
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  page: number
  setPage: (page: number) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string) => void
  toProjectBranchRuleCreate?: () => string
  toProjectTagRuleCreate?: () => string
  showParentScopeLabelsCheckbox?: boolean
  parentScopeLabelsChecked?: boolean
  onParentScopeLabelsChange?: (checked: boolean) => void
  ruleTypeFilter?: 'branch' | 'tag' | 'push' | null
  setRuleTypeFilter?: (filter: 'branch' | 'tag' | 'push' | null) => void
  toProjectRuleDetails?: (identifier: string, scope: number) => string
}
export const ProjectRulesPage: FC<ProjectRulesPageProps> = ({
  useProjectRulesStore,
  isLoading,
  searchQuery,
  setSearchQuery,
  page,
  setPage,
  openRulesAlertDeleteDialog,
  apiError,
  handleRuleClick,
  toProjectBranchRuleCreate,
  toProjectTagRuleCreate,
  showParentScopeLabelsCheckbox = false,
  parentScopeLabelsChecked = false,
  onParentScopeLabelsChange,
  ruleTypeFilter,
  setRuleTypeFilter,
  toProjectRuleDetails
}) => {
  const { t } = useTranslation()
  const { rules: rulesData, pageSize, totalItems } = useProjectRulesStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        <Text as="h1" variant="heading-section" className="mb-6">
          {t('views:projectSettings.rules', 'Rules')}
        </Text>
        {showParentScopeLabelsCheckbox && (
          <div className="mb-[18px]">
            <Checkbox
              id="parent-labels"
              checked={parentScopeLabelsChecked}
              onCheckedChange={onParentScopeLabelsChange}
              label={t('views:rules.showParentRules', 'Show rules from parent scopes')}
            />
          </div>
        )}
        {!rulesData?.length && !isDirtyList && !isLoading ? (
          <NoData
            withBorder
            textWrapperClassName="max-w-[350px]"
            imageName="no-data-members"
            title={t('views:noData.rules', 'No rules yet')}
            description={[
              t(
                'views:noData.noRules',
                'There are no rules in this project. Click on the button below to start adding rules.'
              )
            ]}
            primaryButton={{
              label: t('views:projectSettings.addRule', 'Add new rule'),
              to: 'create/branch'
            }}
          />
        ) : (
          <RepoSettingsGeneralRules
            rules={rulesData}
            isLoading={isLoading}
            apiError={apiError}
            handleRuleClick={handleRuleClick}
            openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
            rulesSearchQuery={searchQuery}
            setRulesSearchQuery={setSearchQuery}
            projectScope
            toRepoBranchRuleCreate={toProjectBranchRuleCreate}
            toRepoTagRuleCreate={toProjectTagRuleCreate}
            toProjectRuleDetails={toProjectRuleDetails}
            ruleTypeFilter={ruleTypeFilter}
            setRuleTypeFilter={setRuleTypeFilter}
          />
        )}

        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
ProjectRulesPage.displayName = 'ProjectRulesPage'
