import { useState } from 'react'

import { useRepoRulesStore } from '@subjects/views/repo-general-settings/use-repo-rules-store'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ErrorTypes, RepoSettingsGeneralPage } from '@harnessio/ui/views'

const loadingStates = {
  isLoadingRepoData: false,
  isUpdatingRepoData: false,
  isLoadingSecuritySettings: false,
  isUpdatingSecuritySettings: false,
  isRulesLoading: false
}

// Simple dummy component that satisfies the type requirement
const DummyComponent = () => null

export const RepoGeneralSettings = () => {
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

  return (
    <>
      <RepoSettingsGeneralPage
        handleRepoUpdate={() => {}}
        handleUpdateSecuritySettings={() => {}}
        apiError={null}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={false}
        useRepoRulesStore={useRepoRulesStore}
        handleRuleClick={() => {}}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
        rulesSearchQuery={rulesSearchQuery}
        setRulesSearchQuery={setRulesSearchQuery}
        branchSelectorRenderer={DummyComponent}
      />

      <DeleteAlertDialog
        open={isRulesAlertDeleteDialogOpen}
        onClose={closeRulesAlertDeleteDialog}
        deleteFn={() => {}}
        error={apiError?.type === ErrorTypes.DELETE_RULE ? apiError : null}
        type="rule"
        identifier={alertDeleteParams}
        isLoading={false}
      />

      <DeleteAlertDialog
        open={isRepoAlertDeleteDialogOpen}
        onClose={closeRepoAlertDeleteDialog}
        deleteFn={() => {}}
        error={apiError?.type === ErrorTypes.DELETE_REPO ? apiError : null}
        type="repository"
        isLoading={false}
        withForm
      />
    </>
  )
}
