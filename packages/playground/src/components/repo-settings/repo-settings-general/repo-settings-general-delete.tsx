import { Button, ButtonGroup, Spacer, Text } from '@harnessio/canary'

import { ErrorTypes } from './types'

export const RepoSettingsGeneralDelete: React.FC<{
  isLoading?: boolean
  apiError: { type: ErrorTypes; message: string } | null
  openRepoAlertDeleteDialog: () => void
}> = ({ openRepoAlertDeleteDialog, apiError }) => {
  return (
    <>
      <Text size={4} weight="medium">
        Delete Repository
      </Text>
      <Text size={2} as="p" className="max-w-full text-primary/80">
        This will permanently delete this repository, and everything contained in it.{' '}
      </Text>

      {apiError && apiError.type === ErrorTypes.DELETE_REPO && (
        <>
          <Spacer size={2} />
          <Text size={1} className="text-destructive">
            {apiError.message}
          </Text>
        </>
      )}

      <ButtonGroup.Root>
        <>
          <Button type="submit" size="sm" theme="error" onClick={openRepoAlertDeleteDialog}>
            Delete repository
          </Button>
        </>
      </ButtonGroup.Root>
    </>
  )
}
