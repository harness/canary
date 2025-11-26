import { FC, useCallback, useMemo } from 'react'

import { Button, Checkbox, DropdownMenu, IconV2, Layout, NoData, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ErrorTypes, IProjectRulesStore, RuleType, SandboxLayout } from '@/views'
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

  const ruleCreationConfig = useMemo(
    () => [
      {
        type: RuleType.TAG,
        title: t('views:repos.createTagRuleButton', 'Create Tag Rule'),
        navigateTo: toProjectTagRuleCreate
      },
      {
        type: RuleType.BRANCH,
        title: t('views:repos.createBranchRuleButton', 'Create Branch Rule'),
        navigateTo: toProjectBranchRuleCreate
      },
      {
        type: RuleType.PUSH,
        title: t('views:repos.createPushRuleButton', 'Create Push Rule'),
        navigateTo: toProjectPushRuleCreate
      }
    ],
    [toProjectTagRuleCreate, toProjectBranchRuleCreate, toProjectPushRuleCreate]
  )

  const handleCreateRule = useCallback(
    (link?: () => string) => {
      if (link) {
        navigate(link())
      }
    },
    [navigate]
  )

  const renderCreateRuleDropdown = useCallback(
    () => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button>
            <IconV2 name="plus" size="sm" />
            {t('views:repos.createRuleButton', 'Create Rule')}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {ruleCreationConfig.map(({ type, title, navigateTo }) => (
            <DropdownMenu.Item key={type} title={title} onClick={() => handleCreateRule(navigateTo)} />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ),
    [t, ruleCreationConfig, handleCreateRule]
  )

  const hasNoRules = !rulesData?.length && !isDirtyList && !isLoading

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

          {hasNoRules ? (
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
              {renderCreateRuleDropdown()}
            </NoData>
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
              toBranchRuleCreate={toProjectBranchRuleCreate}
              toTagRuleCreate={toProjectTagRuleCreate}
              toPushRuleCreate={toProjectPushRuleCreate}
              toProjectRuleDetails={toProjectRuleDetails}
              ruleTypeFilter={ruleTypeFilter}
              setRuleTypeFilter={setRuleTypeFilter}
              paginationProps={{
                totalItems,
                pageSize,
                onPageSizeChange: setPageSize,
                currentPage: page,
                goToPage: setPage
              }}
            />
          )}
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
ProjectRulesPage.displayName = 'ProjectRulesPage'
