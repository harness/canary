import { FC } from 'react'

import { Button, ButtonGroup, Spacer, Text } from '@/components'
import { ErrorTypes, TranslationStore } from '@/views'

export const RepoSettingsGeneralDelete: FC<{
  isLoading?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
  useTranslationStore: () => TranslationStore
}> = ({ openRepoAlertDeleteDialog, apiError, useTranslationStore }) => {
  const { t } = useTranslationStore()
  return (
    <div>
      <Text size={13} weight="medium" className="mb-2.5" as="div">
        {t('views:repos.deleteRepo', 'Delete Repository')}
      </Text>
      <span>
        {t(
          'views:repos.deleteRepoDescription',
          'This will permanently delete this repository, and everything contained in it.'
        )}
      </span>
      <ButtonGroup className="mt-7">
        <Button type="button" variant="destructive" onClick={openRepoAlertDeleteDialog}>
          {t('views:repos.deleteRepoButton', 'Delete repository')}
        </Button>
      </ButtonGroup>
      {apiError && apiError.type === ErrorTypes.DELETE_REPO && (
        <>
          <Spacer size={2} />
          <Text size={1} className="text-cn-foreground-danger">
            {apiError.message}
          </Text>
        </>
      )}
    </div>
  )
}
