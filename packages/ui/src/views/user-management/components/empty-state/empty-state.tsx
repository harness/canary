import { IconV2, NoData } from '@/components'
import { useTranslation } from '@/context'
import { DialogLabels } from '@/views/user-management'
import { useDialogData } from '@/views/user-management/components/dialogs/hooks/use-dialog-data'

export const EmptyState = () => {
  const { t } = useTranslation()

  const { handleDialogOpen } = useDialogData()

  return (
    <NoData
      textWrapperClassName="w-[350px]"
      imageName="no-data-members"
      title={t('views:noData.noUsers', 'No Users Found')}
      description={[
        t(
          'views:noData.noUsersDescription',
          'There are no users in this scope. Click on the button below to start adding them.'
        )
      ]}
      primaryButton={{
        label: (
          <>
            <IconV2 name="plus" />
            {t('views:userManagement.newUserButton', 'Add User')}
          </>
        ),
        onClick: () => handleDialogOpen(null, DialogLabels.CREATE_USER)
      }}
    />
  )
}
