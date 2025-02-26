import { NoData } from '@/components'
import { DialogLabels } from '@/views/user-management'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

import { useDialogData } from '../dialogs/hooks'

export const EmptyState = () => {
  const { useTranslationStore } = useUserManagementStore()

  const { t } = useTranslationStore()

  const { handleDialogOpen } = useDialogData()

  return (
    <NoData
      textWrapperClassName="w-[350px]"
      iconName="no-data-members"
      title={t('views:noData.noUsers', 'No Users Found')}
      description={[
        t(
          'views:noData.noUsersDescription',
          'There are no users in this scope. Click on the button below to start adding them.'
        )
      ]}
      primaryButton={{
        label: t('views:userManagement.newUserButton', 'New user'),
        onClick: () => handleDialogOpen(null, DialogLabels.CREATE_USER)
      }}
    />
  )
}
