import { Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@views/layouts/SandboxLayout'

import { RepoSettingsGeneralRules } from './components/repo-settings-general-rules'
import { ErrorTypes, IRepoStore } from './types'

interface RepoSettingsRulesPageProps {
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  useRepoRulesStore: () => IRepoStore
  rulesSearchQuery: string
  setRulesSearchQuery: (query: string) => void
  isRulesLoading: boolean
  apiError: { type: ErrorTypes; message: string } | null
  projectScope?: boolean
  toRepoBranchRuleCreate: () => string
  toRepoTagRuleCreate: () => string
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
  toRepoTagRuleCreate
}) => {
  const { rules } = useRepoRulesStore()
  const { t } = useTranslation()

  return (
    <SandboxLayout.Content className="px-0">
      <Text as="h1" variant="heading-section">
        Rules
      </Text>
      {!projectScope ? (
        <>
          {t(
            'views:repos.rulesDescription',
            'Define standards and automate workflows to ensure better collaboration and control in your repository.'
          )}
        </>
      ) : null}
      <Spacer size={6} />

      <RepoSettingsGeneralRules
        isLoading={isRulesLoading}
        rules={rules}
        apiError={apiError}
        handleRuleClick={handleRuleClick}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        rulesSearchQuery={rulesSearchQuery}
        setRulesSearchQuery={setRulesSearchQuery}
        projectScope={projectScope}
        toRepoBranchRuleCreate={toRepoBranchRuleCreate}
        toRepoTagRuleCreate={toRepoTagRuleCreate}
      />
    </SandboxLayout.Content>
  )
}
