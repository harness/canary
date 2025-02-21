import { useCallback, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils.ts'

import { CreateTagDialog, IBranchSelectorStore, RepoTagsListView } from '@harnessio/ui/views'

import { repoBranchesStore } from '../repo-branches/repo-branches-store'
import { tagsStore } from './repo-tags-store'

export const RepoTagsList = () => {
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
  const useRepoBranchesStore = useCallback((): IBranchSelectorStore => repoBranchesStore, [])
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
        branchQuery={''}
        setBranchQuery={noop}
        useRepoBranchesStore={useRepoBranchesStore}
        isLoading={false}
      />
    </>
  )
}
