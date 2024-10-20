import React from 'react'
import { Text, ButtonGroup, Button } from '@harnessio/canary'

export const RepoSettingsGeneralDelete: React.FC<{ isLoading?: boolean }> = ({
  isLoading = false,
  handleDeleteRepository
}) => {
  return (
    <>
      <Text size={4} weight="medium">
        Delete Repository
      </Text>
      <Text size={2} as="p" className="text-primary/80 max-w-[100%]">
        This will permanently delete this repository, and everything contained in it.{' '}
      </Text>

      <ButtonGroup.Root>
        <>
          <Button type="submit" size="sm" disabled={isLoading} theme="error" onClick={handleDeleteRepository}>
            {!isLoading ? 'Delete repository' : 'Deleting repository...'}
          </Button>
        </>
      </ButtonGroup.Root>
    </>
  )
}
