import React from 'react'
import { FormFieldSet } from '..'
import { RepoSettingsGeneralForm } from '../components/repo-settings/repo-settings-general/repo-settings-general-form'
import { RepoSettingsGeneralRules } from '../components/repo-settings/repo-settings-general/repo-settings-general-rules'
import { RepoSettingsSecurityForm } from '../components/repo-settings/repo-settings-general/repo-settings-general-security'
import { RepoSettingsGeneralDelete } from '../components/repo-settings/repo-settings-general/repo-settings-general-delete'

// interface RepoSettingsGeneralPageProps{
//   repoData: any
// }
function RepoSettingsGeneralPage({
  repoData,
  handleRepoUpdate,
  securityScanning,
  handleUpdateSecuritySettings,
  handleDeleteRepository
}) {
  return (
    <>
      <FormFieldSet.Root>
        <RepoSettingsGeneralForm repoData={repoData} handleRepoUpdate={handleRepoUpdate} />
        <FormFieldSet.Separator />
        <RepoSettingsGeneralRules />
        <FormFieldSet.Separator />
        <RepoSettingsSecurityForm
          securityScanning={securityScanning}
          handleUpdateSecuritySettings={handleUpdateSecuritySettings}
        />
        <FormFieldSet.Separator />
        <RepoSettingsGeneralDelete handleDeleteRepository={handleDeleteRepository} />
      </FormFieldSet.Root>
    </>
  )
}

export { RepoSettingsGeneralPage }
