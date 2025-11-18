import { FC } from 'react'

import {
  Button,
  ButtonLayout,
  Dialog,
  FormSeparator,
  Layout,
  PermissionIdentifier,
  ResourceType,
  Text
} from '@/components'
import { useComponents, useTranslation } from '@/context'
import { ErrorTypes } from '@/views'

export const RepoSettingsGeneralDelete: FC<{
  isLoading?: boolean
  archived?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
  openRepoArchiveDialog: () => void
  isUpdatingArchive?: boolean
}> = ({ openRepoAlertDeleteDialog, apiError, openRepoArchiveDialog, archived, isUpdatingArchive }) => {
  const { RbacButton } = useComponents()
  const { t } = useTranslation()
  return (
    <Layout.Vertical gap="xl">
      <Layout.Vertical gap="xl">
        <Layout.Vertical gap="xs">
          <Text variant="heading-subsection" as="h3">
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
          <Dialog.Trigger>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                openRepoArchiveDialog()
              }}
              disabled={isUpdatingArchive}
            >
              {isUpdatingArchive
                ? archived
                  ? t('views:repos.unarchiving', 'Unarchiving...')
                  : t('views:repos.archiving', 'Archiving...')
                : archived
                  ? t('views:repos.unarchiveRepoButton', 'Unarchive Repository')
                  : t('views:repos.archiveRepoButton', 'Archive Repository')}
            </Button>
          </Dialog.Trigger>
        </ButtonLayout>

        {apiError && apiError.type === ErrorTypes.ARCHIVE_REPO && <Text color="danger">{apiError.message}</Text>}
      </Layout.Vertical>
      <FormSeparator />
      <Layout.Vertical gap="xl">
        <Layout.Vertical gap="xs">
          <Text variant="heading-subsection" as="h3">
            {t('views:repos.deleteRepo', 'Delete repository')}
          </Text>
          <Text as="span" variant="body-normal">
            {t(
              'views:repos.deleteRepoDescription',
              'This will permanently delete this repository, and everything contained in it.'
            )}
          </Text>
        </Layout.Vertical>

        <ButtonLayout horizontalAlign="start">
          <Dialog.Trigger>
            <RbacButton
              type="button"
              variant="primary"
              theme="danger"
              onClick={openRepoAlertDeleteDialog}
              rbac={{
                resource: { resourceType: ResourceType.CODE_REPOSITORY },
                permissions: [PermissionIdentifier.CODE_REPO_DELETE]
              }}
            >
              {t('views:repos.deleteRepoButton', 'Delete Repository')}
            </RbacButton>
          </Dialog.Trigger>
        </ButtonLayout>

        {apiError && apiError.type === ErrorTypes.DELETE_REPO && <Text color="danger">{apiError.message}</Text>}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
