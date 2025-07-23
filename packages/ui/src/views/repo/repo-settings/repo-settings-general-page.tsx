import { FC } from 'react'

import { Fieldset, FormSeparator, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { BranchSelectorContainerProps } from '@/views/repo/components'

import { RepoSettingsGeneralDelete } from './components/repo-settings-general-delete'
import { RepoSettingsGeneralForm } from './components/repo-settings-general-form'
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
  openRepoAlertDeleteDialog: () => void
  openRepoArchiveDialog: () => void
  useRepoRulesStore: () => IRepoStore
  branchSelectorRenderer: React.ComponentType<BranchSelectorContainerProps>
}

export const RepoSettingsGeneralPage: FC<RepoSettingsGeneralPageProps> = ({
  handleRepoUpdate,
  handleUpdateSecuritySettings,
  apiError,
  loadingStates,
  isRepoUpdateSuccess,
  openRepoAlertDeleteDialog,
  openRepoArchiveDialog,
  useRepoRulesStore,
  branchSelectorRenderer
}) => {
  const { t } = useTranslation()

  const { repoData, securityScanning, verifyCommitterIdentity } = useRepoRulesStore()

  return (
    <SandboxLayout.Content className="max-w-[570px] px-0">
      <Text as="h1" variant="heading-section" className="mb-10">
        {t('views:repos.settings', 'Settings')}
      </Text>

      <Fieldset>
        <RepoSettingsGeneralForm
          repoData={repoData}
          handleRepoUpdate={handleRepoUpdate}
          apiError={apiError}
          isLoadingRepoData={loadingStates.isLoadingRepoData}
          isUpdatingRepoData={loadingStates.isUpdatingRepoData}
          isRepoUpdateSuccess={isRepoUpdateSuccess}
          branchSelectorRenderer={branchSelectorRenderer}
        />
        <FormSeparator />
        <RepoSettingsSecurityForm
          securityScanning={securityScanning}
          verifyCommitterIdentity={verifyCommitterIdentity}
          handleUpdateSecuritySettings={handleUpdateSecuritySettings}
          apiError={apiError}
          isUpdatingSecuritySettings={loadingStates.isUpdatingSecuritySettings}
          isLoadingSecuritySettings={loadingStates.isLoadingSecuritySettings}
        />
        <FormSeparator />
        <RepoSettingsGeneralDelete
          archived={repoData?.archived}
          apiError={apiError}
          openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
          openRepoArchiveDialog={openRepoArchiveDialog}
        />
      </Fieldset>
    </SandboxLayout.Content>
  )
}
