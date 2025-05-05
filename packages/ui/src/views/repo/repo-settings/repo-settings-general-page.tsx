import { FC, useEffect, useRef } from 'react'

import { Fieldset, FormSeparator } from '@/components'
import { useRouterContext } from '@/context'
import { BranchSelectorListItem, SandboxLayout, TranslationStore } from '@/views'
import { BranchSelectorContainerProps, BranchSelectorTab } from '@/views/repo/components'

import { RepoSettingsGeneralDelete } from './components/repo-settings-general-delete'
import { RepoSettingsGeneralForm } from './components/repo-settings-general-form'
import { RepoSettingsGeneralRules } from './components/repo-settings-general-rules'
import { RepoSettingsSecurityForm, RepoSettingsSecurityFormFields } from './components/repo-settings-general-security'
import { ErrorTypes, IRepoStore, RepoUpdateData } from './types'

interface ILoadingStates {
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isLoadingSecuritySettings: boolean
  isUpdatingSecuritySettings: boolean
  isRulesLoading: boolean
}

interface RepoSettingsGeneralPageProps {
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  loadingStates: ILoadingStates
  isRepoUpdateSuccess: boolean
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  openRepoAlertDeleteDialog: () => void
  useRepoRulesStore: () => IRepoStore
  useTranslationStore: () => TranslationStore
  rulesSearchQuery: string
  setRulesSearchQuery: (query: string) => void
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
}

export const RepoSettingsGeneralPage: FC<RepoSettingsGeneralPageProps> = ({
  handleRepoUpdate,
  handleUpdateSecuritySettings,
  apiError,
  loadingStates,
  isRepoUpdateSuccess,
  handleRuleClick,
  openRulesAlertDeleteDialog,
  openRepoAlertDeleteDialog,
  useRepoRulesStore,
  useTranslationStore,
  rulesSearchQuery,
  setRulesSearchQuery,
  branchSelectorRenderer
}) => {
  const { location } = useRouterContext()
  const { t } = useTranslationStore()
  const rulesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (location.pathname.endsWith('/rules')) {
      rulesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (location.pathname.endsWith('/general')) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname])

  const { repoData, securityScanning, rules } = useRepoRulesStore()

  return (
    <SandboxLayout.Content className="max-w-[570px] px-0">
      <h1 className="mb-10 text-2xl font-medium text-cn-foreground-1">{t('views:repos.settings', 'Settings')}</h1>

      <Fieldset>
        <RepoSettingsGeneralForm
          repoData={repoData}
          handleRepoUpdate={handleRepoUpdate}
          apiError={apiError}
          isLoadingRepoData={loadingStates.isLoadingRepoData}
          isUpdatingRepoData={loadingStates.isUpdatingRepoData}
          isRepoUpdateSuccess={isRepoUpdateSuccess}
          useTranslationStore={useTranslationStore}
          branchSelectorRenderer={branchSelectorRenderer}
        />
        <FormSeparator />
        <div ref={rulesRef}>
          <RepoSettingsGeneralRules
            isLoading={loadingStates.isRulesLoading}
            rules={rules}
            apiError={apiError}
            handleRuleClick={handleRuleClick}
            openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
            useTranslationStore={useTranslationStore}
            rulesSearchQuery={rulesSearchQuery}
            setRulesSearchQuery={setRulesSearchQuery}
          />
        </div>
        <FormSeparator />
        <RepoSettingsSecurityForm
          securityScanning={securityScanning}
          handleUpdateSecuritySettings={handleUpdateSecuritySettings}
          apiError={apiError}
          isUpdatingSecuritySettings={loadingStates.isUpdatingSecuritySettings}
          isLoadingSecuritySettings={loadingStates.isLoadingSecuritySettings}
          useTranslationStore={useTranslationStore}
        />
        <FormSeparator />
        <RepoSettingsGeneralDelete
          apiError={apiError}
          openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
          useTranslationStore={useTranslationStore}
        />
      </Fieldset>
    </SandboxLayout.Content>
  )
}
