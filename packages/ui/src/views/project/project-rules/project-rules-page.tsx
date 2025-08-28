import { FC, useMemo } from 'react'

import { Checkbox, Layout, NoData, Pagination, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
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
  toProjectRuleDetails?: (identifier: string, scope: number) => void
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
  const { navigate } = useRouterContext()
  const { rules: rulesData, pageSize, totalItems } = useProjectRulesStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  if (!rulesData?.length && !isDirtyList && !isLoading) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-cog"
        title={t('views:noData.noRules', 'No rules yet')}
        description={[
          t(
            'views:noData.noRulesDescription',
            'There are no rules in this project. Click on the button below to start adding rules.'
          )
        ]}
        splitButton={{
          icon: 'plus',
          label: t('views:repos.createBranchRuleButton', 'Create Branch Rule'),
          options: [{ value: 'tag-rule', label: t('views:repos.createTagRuleButton', 'Create Tag Rule') }],
          handleOptionChange: option => {
            if (option === 'tag-rule') {
              navigate(toProjectTagRuleCreate?.() || '')
            }
          },
          handleButtonClick: () => navigate(toProjectBranchRuleCreate?.() || '')
        }}
      />
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="gap-y-cn-xl">
        <Text as="h1" variant="heading-section">
          {t('views:projectSettings.rules', 'Rules')}
        </Text>

        <Layout.Vertical grow>
          {showParentScopeLabelsCheckbox && (
            <Checkbox
              id="parent-labels"
              checked={parentScopeLabelsChecked}
              onCheckedChange={onParentScopeLabelsChange}
              label={t('views:rules.showParentRules', 'Show rules from parent scopes')}
            />
          )}

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
        </Layout.Vertical>

        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
ProjectRulesPage.displayName = 'ProjectRulesPage'
