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
    <Layout.Flex direction="column" gap="xl">
      <Layout.Vertical gap="xl">
        <Layout.Vertical gap="xs">
          <Text variant="heading-subsection">
            {archived
              ? t('views:repos.unarchiveRepo', 'Unarchive this repository')
              : t('views:repos.archiveRepo', 'Archive this repository')}
          </Text>
          <Text as="span" variant="body-normal">
            {archived
              ? t('views:repos.unarchiveRepoDescription', 'Unarchive this repository to make it read-write.')
              : t(
                  'views:repos.archiveRepoDescription',
                  'Set this repository to archived and restrict it to read-only access.'
                )}
          </Text>
        </Layout.Vertical>
        <ButtonLayout horizontalAlign="start">
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
      </Layout.Vertical>
      <FormSeparator />
      <Layout.Vertical gap="xl">
        <Layout.Vertical gap="xs">
          <Text variant="heading-subsection">{t('views:repos.deleteRepo', 'Delete repository')}</Text>
          <Text as="span" variant="body-normal">
            {t(
              'views:repos.deleteRepoDescription',
              'This will permanently delete this repository, and everything contained in it.'
            )}
          </Text>
        </Layout.Vertical>
        <ButtonLayout horizontalAlign="start">
          <Button type="button" variant="primary" theme="danger" onClick={openRepoAlertDeleteDialog}>
            {t('views:repos.deleteRepoButton', 'Delete this repository')}
          </Button>
        </ButtonLayout>
        {apiError && apiError.type === ErrorTypes.DELETE_REPO && (
          <>
            <Spacer size={2} />
            <Text color="danger">{apiError.message}</Text>
          </>
        )}
      </Layout.Vertical>
    </Layout.Flex>
  )
}
