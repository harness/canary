import { useCallback, useState } from 'react'

import { repoBranchListStore } from '@subjects/stores/repo-branch-store'
import { useRepoRulesStore } from '@subjects/views/repo-general-settings/use-repo-rules-store'
import { useTranslationStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ErrorTypes, RepoSettingsGeneralPage } from '@harnessio/ui/views'

const loadingStates = {
  isLoadingRepoData: false,
  isUpdatingRepoData: false,
  isLoadingSecuritySettings: false,
  isUpdatingSecuritySettings: false,
  isRulesLoading: false
}

export const RepoGeneralSettings = () => {
  const [branchQuery, setBranchQuery] = useState('')
  const [rulesSearchQuery, setRulesSearchQuery] = useState('')
  const [isRulesAlertDeleteDialogOpen, setIsRulesAlertDeleteDialogOpen] = useState(false)
  const [isRepoAlertDeleteDialogOpen, setRepoAlertDeleteDialogOpen] = useState(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState('')
  const [apiError, _setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)

  const closeRulesAlertDeleteDialog = () => setIsRulesAlertDeleteDialogOpen(false)
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setIsRulesAlertDeleteDialogOpen(true)
  }

  const closeRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(false)
  const openRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(true)

  const useRepoBranchesStore = useCallback(() => ({ ...repoBranchListStore }), [])

  return (
    <>
      <RepoSettingsGeneralPage
        handleRepoUpdate={() => {}}
        selectBranchOrTag={() => {}}
        handleUpdateSecuritySettings={() => {}}
        apiError={null}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={false}
        useRepoRulesStore={useRepoRulesStore}
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationStore}
        handleRuleClick={() => {}}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
        searchQuery={branchQuery}
        setSearchQuery={setBranchQuery}
        rulesSearchQuery={rulesSearchQuery}
        setRulesSearchQuery={setRulesSearchQuery}
      />

      <DeleteAlertDialog
        open={isRulesAlertDeleteDialogOpen}
        onClose={closeRulesAlertDeleteDialog}
        deleteFn={() => {}}
        error={apiError?.type === ErrorTypes.DELETE_RULE ? apiError : null}
        type="rule"
        identifier={alertDeleteParams}
        isLoading={false}
        useTranslationStore={useTranslationStore}
      />

      <DeleteAlertDialog
        open={isRepoAlertDeleteDialogOpen}
        onClose={closeRepoAlertDeleteDialog}
        deleteFn={() => {}}
        error={apiError?.type === ErrorTypes.DELETE_REPO ? apiError : null}
        type="repository"
        isLoading={false}
        useTranslationStore={useTranslationStore}
        withForm
      />
    </>
  )
}
