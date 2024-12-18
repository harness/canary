import React from 'react'

import { Button, ButtonGroup, Spacer, Text } from '@/components'
import { TranslationStore } from '@/views'

import { ErrorTypes } from '../types'

export const RepoSettingsGeneralDelete: React.FC<{
  isLoading?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
  useTranslationStore: () => TranslationStore
}> = ({ openRepoAlertDeleteDialog, apiError, useTranslationStore }) => {
  const { t } = useTranslationStore()
  return (
    <>
      <Text size={4} weight="medium">
        {t('views:repos.deleteRepo', 'Delete Repository')}
      </Text>
      <Text size={2} as="p" className="max-w-full text-primary/80">
        {t(
          'views:repos.deleteRepoDescription',
          'This will permanently delete this repository, and everything contained in it.'
        )}
      </Text>

      {apiError && apiError.type === ErrorTypes.DELETE_REPO && (
        <>
          <Spacer size={2} />
          <Text size={1} className="text-destructive">
            {apiError.message}
          </Text>
        </>
      )}

      <ButtonGroup>
        <>
          <Button type="submit" size="sm" theme="error" onClick={openRepoAlertDeleteDialog}>
            {t('views:repos.deleteRepoButton', 'Delete repository')}
          </Button>
        </>
      </ButtonGroup>
    </>
  )
}
