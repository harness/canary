import { FC } from 'react'

import { Button, ButtonLayout, FormSeparator, Layout, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { ErrorTypes } from '@/views'

export const RepoSettingsGeneralDelete: FC<{
  isLoading?: boolean
  archived?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
  openRepoArchiveDialog: () => void
}> = ({ openRepoAlertDeleteDialog, apiError, openRepoArchiveDialog, archived }) => {
  const { t } = useTranslation()
  return (
    <Layout.Flex direction="column" gap="md">
      <div>
        <Text variant="heading-subsection" className="mb-2.5">
          {archived
            ? t('views:repos.unarchiveRepo', 'Unarchive Repository')
            : t('views:repos.archiveRepo', 'Archive Repository')}
        </Text>
        <span>
          {archived
            ? t('views:repos.unarchiveRepoDescription', 'Unarchive this repository to make it read-write.')
            : t(
                'views:repos.archiveRepoDescription',
                'Set this repository to archived and restrict it to read-only access.'
              )}
        </span>
        <ButtonLayout horizontalAlign="start" className="mt-2.5">
          <Button type="button" variant="secondary" onClick={openRepoArchiveDialog}>
            {archived
              ? t('views:repos.unarchiveRepoButton', 'Unarchive repository')
              : t('views:repos.archiveRepoButton', 'Archive repository')}
          </Button>
        </ButtonLayout>
        {apiError && apiError.type === ErrorTypes.ARCHIVE_REPO && (
          <>
            <Spacer size={2} />
            <Text color="danger">{apiError.message}</Text>
          </>
        )}
      </div>
      <div>
        <Text variant="heading-subsection" className="mb-2.5">
          {t('views:repos.deleteRepo', 'Delete Repository')}
        </Text>
        <span>
          {t(
            'views:repos.deleteRepoDescription',
            'This will permanently delete this repository, and everything contained in it.'
          )}
        </span>
        <ButtonLayout horizontalAlign="start" className="mt-2.5">
          <Button type="button" variant="primary" theme="danger" onClick={openRepoAlertDeleteDialog}>
            {t('views:repos.deleteRepoButton', 'Delete repository')}
          </Button>
        </ButtonLayout>
        {apiError && apiError.type === ErrorTypes.DELETE_REPO && (
          <>
            <Spacer size={2} />
            <Text color="danger">{apiError.message}</Text>
          </>
        )}
      </div>
    </Layout.Flex>
  )
}
