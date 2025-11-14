import { FC, useMemo } from 'react'

import { Button, Checkbox, DropdownMenu, IconV2, Layout, NoData, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ErrorTypes, IProjectRulesStore, SandboxLayout } from '@/views'
import { RepoSettingsGeneralRules } from '@views/repo/repo-settings/components/repo-settings-general-rules'

export interface ProjectRulesPageProps {
  useProjectRulesStore: () => IProjectRulesStore
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  openRulesAlertDeleteDialog: (identifier: string, scope: number) => void
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string, scope: number) => void
  toProjectBranchRuleCreate?: () => string
  toProjectTagRuleCreate?: () => string
  toProjectPushRuleCreate?: () => string
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
  openRulesAlertDeleteDialog,
  apiError,
  handleRuleClick,
  toProjectBranchRuleCreate,
  toProjectTagRuleCreate,
  toProjectPushRuleCreate,
  showParentScopeLabelsCheckbox = false,
  parentScopeLabelsChecked = false,
  onParentScopeLabelsChange,
  ruleTypeFilter,
  setRuleTypeFilter,
  toProjectRuleDetails
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()
  const { rules: rulesData, pageSize, totalItems, setPageSize, page, setPage } = useProjectRulesStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery || ruleTypeFilter !== null
  }, [page, searchQuery, ruleTypeFilter])

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
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button>
              <IconV2 name="plus" size="sm" />
              {t('views:repos.createRuleButton', 'Create Rule')}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              title={t('views:repos.createTagRuleButton', 'Create Tag Rule')}
              onClick={() => navigate(toProjectTagRuleCreate?.() || '')}
            />
            <DropdownMenu.Item
              title={t('views:repos.createBranchRuleButton', 'Create Branch Rule')}
              onClick={() => navigate(toProjectBranchRuleCreate?.() || '')}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </NoData>
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
            toBranchRuleCreate={toProjectBranchRuleCreate}
            toTagRuleCreate={toProjectTagRuleCreate}
            toPushRuleCreate={toProjectPushRuleCreate}
            toProjectRuleDetails={toProjectRuleDetails}
            ruleTypeFilter={ruleTypeFilter}
            setRuleTypeFilter={setRuleTypeFilter}
            paginationProps={{
              totalItems: totalItems,
              pageSize: pageSize,
              onPageSizeChange: setPageSize,
              currentPage: page,
              goToPage: setPage
            }}
          />
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
ProjectRulesPage.displayName = 'ProjectRulesPage'
