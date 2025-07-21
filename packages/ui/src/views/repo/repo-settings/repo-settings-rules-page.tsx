import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { Button, Spacer, Text } from '@/components'
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
}

export const RepoSettingsRulesPage: React.FC<RepoSettingsRulesPageProps> = ({
  handleRuleClick,
  openRulesAlertDeleteDialog,
  useRepoRulesStore,
  rulesSearchQuery,
  setRulesSearchQuery,
  isRulesLoading,
  apiError,
  projectScope = false
}) => {
  const { rules } = useRepoRulesStore()
  const { t } = useTranslation()

  const isShowRulesContent = useMemo(() => {
    return !!rules?.length || !!rulesSearchQuery?.length
  }, [rulesSearchQuery, rules])

  return (
    <SandboxLayout.Content className="px-0">
      <Text as="h1" variant="heading-section" color="foreground-1">
        Rules
      </Text>
      {!projectScope ? (
        <>
          <div className="flex flex-row">
            {t(
              'views:repos.rulesDescription',
              'Define standards and automate workflows to ensure better collaboration and control in your repository.'
            )}
            {!isRulesLoading && !isShowRulesContent && (
              <NavLink className="ml-auto" to="../rules/create">
                <Button variant="outline">{t('views:repos.createRuleButton', 'Create rule')}</Button>
              </NavLink>
            )}
          </div>
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
      />
    </SandboxLayout.Content>
  )
}
