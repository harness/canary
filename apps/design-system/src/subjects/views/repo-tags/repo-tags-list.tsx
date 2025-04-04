import { useCallback, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils.ts'

import { CreateTagDialog, RepoTagsListView } from '@harnessio/ui/views'

import { tagsStore } from './repo-tags-store'

export const RepoTagsList = () => {
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
  const useRepoTagsStore = useCallback(() => tagsStore, [])

  return (
    <>
      <RepoTagsListView
        useTranslationStore={useTranslationStore}
        isLoading={false}
        openCreateBranchDialog={() => setOpenCreateTagDialog(true)}
        searchQuery={''}
        setSearchQuery={noop}
        onDeleteTag={noop}
        useRepoTagsStore={useRepoTagsStore}
        toCommitDetails={() => ''}
        openCreateTagDialog={noop}
      />
      <CreateTagDialog
        useTranslationStore={useTranslationStore}
        open={openCreateTagDialog}
        onClose={() => setOpenCreateTagDialog(false)}
        onSubmit={noop}
        isLoading={false}
        error={''}
        selectedBranchOrTag={null}
        renderProp={() => null}
      />
    </>
  )
}
