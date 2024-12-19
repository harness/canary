import { useRef } from 'react'

import { Fieldset, FormSeparator } from '@/components'
import { BranchSelectorListItem, IBranchSelectorStore, SandboxLayout, TranslationStore } from '@/views'
import { BranchSelectorTab } from '@/views/repo/components'

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
}
interface RepoSettingsGeneralPageProps {
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  handleRepoUpdate: (data: RepoUpdateData) => void
  apiError: { type: ErrorTypes; message: string } | null
  loadingStates: ILoadingStates
  isRepoUpdateSuccess: boolean
  selectBranchOrTag: (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => void
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  openRepoAlertDeleteDialog: () => void
  useRepoRulesStore: () => IRepoStore
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  searchQuery: string
  setSearchQuery: (query: string) => void
}
const RepoSettingsGeneralPage: React.FC<RepoSettingsGeneralPageProps> = ({
  handleRepoUpdate,
  handleUpdateSecuritySettings,
  apiError,
  loadingStates,
  isRepoUpdateSuccess,
  handleRuleClick,
  openRulesAlertDeleteDialog,
  openRepoAlertDeleteDialog,
  useRepoRulesStore,
  useRepoBranchesStore,
  useTranslationStore,
  selectBranchOrTag,
  searchQuery,
  setSearchQuery
}) => {
  const rulesRef = useRef<HTMLDivElement | null>(null)

  if (window.location.pathname.endsWith('/rules')) {
    rulesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  if (window.location.pathname.endsWith('/general')) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { repoData, securityScanning, rules } = useRepoRulesStore()

  return (
    <SandboxLayout.Content className="ml-0" maxWidth="2xl">
      <Fieldset>
        <RepoSettingsGeneralForm
          repoData={repoData}
          handleRepoUpdate={handleRepoUpdate}
          apiError={apiError}
          isLoadingRepoData={loadingStates.isLoadingRepoData}
          isUpdatingRepoData={loadingStates.isUpdatingRepoData}
          isRepoUpdateSuccess={isRepoUpdateSuccess}
          useRepoBranchesStore={useRepoBranchesStore}
          useTranslationStore={useTranslationStore}
          selectBranchOrTag={selectBranchOrTag}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <FormSeparator />
        <div ref={rulesRef}>
          <RepoSettingsGeneralRules
            rules={rules}
            apiError={apiError}
            handleRuleClick={handleRuleClick}
            openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
            useTranslationStore={useTranslationStore}
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

export { RepoSettingsGeneralPage }
