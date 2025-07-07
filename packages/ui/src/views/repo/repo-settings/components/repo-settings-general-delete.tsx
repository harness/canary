import { FC } from 'react'

import { Button, ButtonLayout, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { ErrorTypes } from '@/views'

export const RepoSettingsGeneralDelete: FC<{
  isLoading?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
}> = ({ openRepoAlertDeleteDialog, apiError }) => {
  const { t } = useTranslation()
  return (
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
      <ButtonLayout horizontalAlign="start" className="mt-7">
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
  )
}
