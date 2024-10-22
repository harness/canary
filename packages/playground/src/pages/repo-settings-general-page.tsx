import React from 'react'
import { FormFieldSet } from '..'
import { RepoSettingsGeneralForm } from '../components/repo-settings/repo-settings-general/repo-settings-general-form'
import { RepoSettingsGeneralRules } from '../components/repo-settings/repo-settings-general/repo-settings-general-rules'
import { RepoSettingsSecurityForm } from '../components/repo-settings/repo-settings-general/repo-settings-general-security'
import { RepoSettingsGeneralDelete } from '../components/repo-settings/repo-settings-general/repo-settings-general-delete'
import { RepoData, RepoUpdateData, ErrorTypes } from '../components/repo-settings/repo-settings-general/types'
import { RepoSettingsSecurityFormFields } from '../components/repo-settings/repo-settings-general/repo-settings-general-security'

interface ILoadingStates {
  isLoadingRepoData: boolean
  isUpdatingRepoData: boolean
  isLoadingSecuritySettings: boolean
  isDeletingRepo: boolean
  isUpdatingSecuritySettings: boolean
}
interface RepoSettingsGeneralPageProps {
  repoData: RepoData
  securityScanning: boolean
  handleUpdateSecuritySettings: (data: RepoSettingsSecurityFormFields) => void
  handleRepoUpdate: (data: RepoUpdateData) => void
  handleDeleteRepository: () => void
  apiError: { type: ErrorTypes; message: string } | null
  loadingStates: ILoadingStates
  isRepoUpdateSuccess: boolean
}
const RepoSettingsGeneralPage: React.FC<RepoSettingsGeneralPageProps> = ({
  repoData,
  handleRepoUpdate,
  securityScanning,
  handleUpdateSecuritySettings,
  handleDeleteRepository,
  apiError,
  loadingStates,
  isRepoUpdateSuccess
}) => {
  return (
    <>
      <FormFieldSet.Root>
        <RepoSettingsGeneralForm
          repoData={repoData}
          handleRepoUpdate={handleRepoUpdate}
          apiError={apiError}
          isLoadingRepoData={loadingStates.isLoadingRepoData}
          isUpdatingRepoData={loadingStates.isUpdatingRepoData}
          isRepoUpdateSuccess={isRepoUpdateSuccess}
        />
        <FormFieldSet.Separator />
        <RepoSettingsGeneralRules />
        <FormFieldSet.Separator />
        <RepoSettingsSecurityForm
          securityScanning={securityScanning}
          handleUpdateSecuritySettings={handleUpdateSecuritySettings}
          apiError={apiError}
          isUpdatingSecuritySettings={loadingStates.isUpdatingSecuritySettings}
          isLoadingSecuritySettings={loadingStates?.isLoadingSecuritySettings}
        />
        <FormFieldSet.Separator />
        <RepoSettingsGeneralDelete
          handleDeleteRepository={handleDeleteRepository}
          apiError={apiError}
          isDeletingRepo={loadingStates.isDeletingRepo}
        />
      </FormFieldSet.Root>
    </>
  )
}

export { RepoSettingsGeneralPage }
