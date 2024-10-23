import React from 'react'
import { Text, ButtonGroup, Button, Spacer } from '@harnessio/canary'
import { ErrorTypes } from './types'

export const RepoSettingsGeneralDelete: React.FC<{
  isLoading?: boolean
  handleDeleteRepository: () => void
  apiError: { type: ErrorTypes; message: string } | null
  isDeletingRepo: boolean
}> = ({ handleDeleteRepository, apiError, isDeletingRepo }) => {
  return (
    <>
      <Text size={4} weight="medium">
        Delete Repository
      </Text>
      <Text size={2} as="p" className="text-primary/80 max-w-[100%]">
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
          <Button type="submit" size="sm" disabled={isDeletingRepo} theme="error" onClick={handleDeleteRepository}>
            {!isDeletingRepo ? 'Delete repository' : 'Deleting repository...'}
          </Button>
        </>
      </ButtonGroup.Root>
    </>
  )
}
