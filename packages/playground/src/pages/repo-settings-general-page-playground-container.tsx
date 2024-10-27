import { RepoSettingsGeneralPage } from './repo-settings-general-page'
import { mockRepoData } from './mocks/repo-settings/mockRepoData'
import { noop } from 'lodash-es'
import { branchRules } from './mocks/repo-settings/mockRulesData'
import React from 'react'
export const RepoSettingsGeneralPlaygroundContainer = () => {
  const loadingStates = {
    isLoadingRepoData: false,
    isUpdatingRepoData: false,
    isLoadingSecuritySettings: false,
    isUpdatingSecuritySettings: false
  }
  return (
    <>
      <RepoSettingsGeneralPage
        repoData={mockRepoData}
        handleRepoUpdate={noop}
        securityScanning={false}
        handleUpdateSecuritySettings={noop}
        apiError={null}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={false}
        rules={branchRules}
        handleRuleClick={noop}
        openRulesAlertDeleteDialog={noop}
        openRepoAlertDeleteDialog={noop}
      />
    </>
  )
}
