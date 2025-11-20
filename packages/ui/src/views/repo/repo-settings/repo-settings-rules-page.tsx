import { Checkbox, Layout, Text } from '@/components'
import { useTranslation } from '@/context'

import { RepoSettingsGeneralRules } from './components/repo-settings-general-rules'
import { ErrorTypes, IRepoStore } from './types'

interface RepoSettingsRulesPageProps {
  handleRuleClick: (identifier: string, scope: number) => void
  openRulesAlertDeleteDialog: (identifier: string, scope: number) => void
  useRepoRulesStore: () => IRepoStore
  rulesSearchQuery: string
  setRulesSearchQuery: (query: string) => void
  isRulesLoading: boolean
  apiError: { type: ErrorTypes; message: string } | null
  projectScope?: boolean
  toRepoBranchRuleCreate: () => string
  toRepoTagRuleCreate: () => string
  toRepoPushRuleCreate: () => string
  showParentScopeLabelsCheckbox?: boolean
  parentScopeLabelsChecked?: boolean
  onParentScopeLabelsChange?: (checked: boolean) => void
  ruleTypeFilter?: 'branch' | 'tag' | 'push' | null
  setRuleTypeFilter?: (filter: 'branch' | 'tag' | 'push' | null) => void
  toProjectRuleDetails?: (identifier: string, scope: number) => void
}

export const RepoSettingsRulesPage: React.FC<RepoSettingsRulesPageProps> = ({
  handleRuleClick,
  openRulesAlertDeleteDialog,
  useRepoRulesStore,
  rulesSearchQuery,
  setRulesSearchQuery,
  isRulesLoading,
  apiError,
  projectScope = false,
  toRepoBranchRuleCreate,
  toRepoTagRuleCreate,
  toRepoPushRuleCreate,
  showParentScopeLabelsCheckbox = false,
  parentScopeLabelsChecked = false,
  onParentScopeLabelsChange,
  ruleTypeFilter,
  setRuleTypeFilter,
  toProjectRuleDetails
}) => {
  const { rules } = useRepoRulesStore()
  const { t } = useTranslation()

  return (
    <Layout.Vertical gap="xl" grow>
      <Layout.Grid gapY="xs">
        <Text as="h1" variant="heading-section">
          Rules
        </Text>
        {!projectScope && (
          <Text className="settings-form-width">
            {t(
              'views:repos.rulesDescription',
              'Define standards and automate workflows to ensure better collaboration and control in your repository.'
            )}
          </Text>
        )}
      </Layout.Grid>

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
          isLoading={isRulesLoading}
          rules={rules}
          apiError={apiError}
          handleRuleClick={handleRuleClick}
          openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
          rulesSearchQuery={rulesSearchQuery}
          setRulesSearchQuery={setRulesSearchQuery}
          projectScope={projectScope}
          toBranchRuleCreate={toRepoBranchRuleCreate}
          toTagRuleCreate={toRepoTagRuleCreate}
          toPushRuleCreate={toRepoPushRuleCreate}
          ruleTypeFilter={ruleTypeFilter}
          setRuleTypeFilter={setRuleTypeFilter}
          toProjectRuleDetails={toProjectRuleDetails}
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
